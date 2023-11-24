import cv2
import numpy as np
import json
import sys
sys.path.append("..")
from segment_anything import sam_model_registry, SamAutomaticMaskGenerator, SamPredictor
from pycocotools import mask as mask_utils
from s3_operations import create_bucket, create_folder, upload_file, list_objects
from dawat_objectstorage import ObjectStorageSample
import os
import boto3

class AutomaticMaskGenerator:
    def __init__(self, sam_checkpoint, model_type='vit_b', device='cuda'):
        self.sam_checkpoint = sam_checkpoint
        self.model_type = model_type
        self.device = device
        self.sam = None
        self.initialize_model()
        self.color = None
        self.imagename = None

    def initialize_model(self):
        from segment_anything import sam_model_registry, SamAutomaticMaskGenerator
        self.sam = sam_model_registry[self.model_type](checkpoint=self.sam_checkpoint)
        self.sam.to(device=self.device)
        
    def generate_masks(self, image_path, imagename):
        image = cv2.imread(image_path)
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        self.imagename = imagename

        mask_generator = SamAutomaticMaskGenerator(self.sam)
        masks = mask_generator.generate(image)
        #여기서 부터 시작이네
        
        
        def rle_encode(img):
            '''
            img: numpy array, 1 - mask, 0 - background
            Returns run length as string formatted
            '''
            pixels = img.flatten()
            pixels = np.concatenate([[0], pixels, [0]])
            runs = np.where(pixels[1:] != pixels[:-1])[0] + 1
            runs[1::2] -= runs[::2]
            return ' '.join(str(x) for x in runs)

        # JSON 변환 함수
        def json_converter(obj):
            if isinstance(obj, np.ndarray):
                return obj.tolist()
            raise TypeError(f"Object of type {obj.__class__.__name__} is not JSON serializable")

        # 이미지 분할 및 마스크 생성 코드...

        data = {}  # data 변수 초기화
        for idx, mask in enumerate(masks):
            rle_encoded_segmentation = rle_encode(np.array(mask["segmentation"]))
            #data[idx] = {
            #    "bbox": mask["bbox"],
            #    "area": mask["area"],
            #    "segmentation": rle_encoded_segmentation,  # RLE 인코딩된 결과
            #    "point_coords": mask["point_coords"],
            #    "crop_box": mask["crop_box"],
            #    "id": idx,
            #}
            data[f'annotation_{idx}'] = {
                "bbox": mask["bbox"],
                "area": mask["area"],
                "segmentation": rle_encoded_segmentation,  # RLE 인코딩된 결과
                "point_coords": mask["point_coords"],
                "crop_box": mask["crop_box"],
                "id": idx,
                "title": f'annotation_{idx}',
            }
        #json_data = json.dumps(data, default=json_converter, indent=4)
        #with open("output.json", "w", encoding="utf-8") as f:
        #    f.write(json_data)

        json_data = json.dumps(data, default=json_converter, indent=4)
        json_path = f'json/{self.imagename}_output.json'
        with open(json_path, "w", encoding="utf-8") as f:
            f.write(json_data)

        with open(json_path, "r") as json_file:
            result_data = json.load(json_file)

        return result_data