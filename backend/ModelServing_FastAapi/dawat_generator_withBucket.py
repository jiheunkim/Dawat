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
        
        
        def json_converter(obj):
            if isinstance(obj, np.ndarray):  # 'numpy' 대신 'np' 사용
                return obj.tolist()
            raise TypeError(f"Object of type {obj.__class__.__name__} is not JSON serializable")

        data = {}
        for idx, mask in enumerate(masks):
            data[idx] = {
                "bbox": mask["bbox"],
                "area": mask["area"],
                "segmentation": mask["segmentation"],
                "predicted_iou": mask["predicted_iou"],
                "point_coords":mask["point_coords"],
                "crop_box": mask["crop_box"],
                "id": idx,  # 만약 mask 내에 id 정보가 있다면, "id": mask["id"] 로 변경
                "stability_score": mask["stability_score"]
            }


        json_data = json.dumps(data, default=json_converter, indent=4)
        with open("output.json", "w", encoding="utf-8") as f:
            f.write(json_data)
        
        
        
        
        import os
        import random

        def create_masked_image(mask, output_path, alpha=100):
            # 랜덤 색상 생성
            self.color = (random.randint(0, 255), random.randint(0, 255), random.randint(0, 255))

            # 투명한 배경 생성 (RGBA)
            masked_image = np.zeros((mask.shape[0], mask.shape[1], 4), dtype=np.uint8)

            # 마스크 영역에 색상 채우기 (RGB 색상 + 지정된 Alpha 채널)
            masked_image[mask == 255] = [*self.color, alpha]

            cv2.imwrite(output_path, masked_image)
            return output_path

        # masks 디렉토리 생성 (존재하지 않는 경우)
        if not os.path.exists('masks'):
            os.makedirs('masks')
        
        sample = ObjectStorageSample()
        
        
        endpoint_url = 'https://kr.object.ncloudstorage.com'
        bucket_name = 'dawat'


        # JSON 데이터 로드
        with open('output.json', 'r') as file:
            data = json.load(file)

        for idx, mask in data.items():
            segmentation_array = np.array(mask["segmentation"], dtype=np.uint8) * 255
            output_path = f"masks/mask_{idx}.png"

            # 마스크 이미지 생성 및 저장 (투명도 조절)
            # 여기서 alpha 값을 조절합니다
            #local image path
            mask_image_path = create_masked_image(segmentation_array, output_path, alpha=100)
            
            
            local_file_path = mask_image_path #얘가 jupyterhub내에 있는 mask위치
            object_name = f"mask_{idx}.png" #얘가 mask이름
            
            #sample.grant_bucket_acl('dawat',self.imagename, 'public-read')
            sample.put_object('dawat', self.imagename, output_path, local_file_path)

            #여기서 file 저장후 밑에 로컬 파일 경로 수정

            # 로컬 파일 경로를 JSON에 추가
            mask["segmentation_image_url"] = f'{endpoint_url}/{bucket_name}/{self.imagename}/masks/{object_name}'
            mask["color"] = self.color

            # segmentation 배열 삭제
            del mask["segmentation"]

        def json_converter(obj):
            if isinstance(obj, np.ndarray):
                return obj.tolist()
            raise TypeError(f"Object of type {obj.__class__.__name__} is not JSON serializable")

        # JSON 데이터 업데이트 및 저장
        json_data = json.dumps(data, default=json_converter, indent=4)
        with open("output.json", "w", encoding="utf-8") as f:
            f.write(json_data)




            return { "OK"}