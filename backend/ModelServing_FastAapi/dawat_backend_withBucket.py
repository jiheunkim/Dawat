import numpy as np
import torch
import matplotlib.pyplot as plt
import cv2
import json
#모델빼기, api요청 들어오면 수정해서 반환하는 api 추가하기
#COCO RLE코드 빼보기
#구현중
from s3_operations import create_bucket, create_folder, upload_file, list_objects

from pycocotools import mask as mask_utils

def show_anns(anns):
    if len(anns) == 0:
        return
    sorted_anns = sorted(anns, key=(lambda x: x['area']), reverse=True)
    ax = plt.gca()
    ax.set_autoscale_on(False)

    img = np.ones((sorted_anns[0]['segmentation'].shape[0], sorted_anns[0]['segmentation'].shape[1], 4))
    img[:,:,3] = 0
    for ann in sorted_anns:
        m = ann['segmentation']
        color_mask = np.concatenate([np.random.random(3), [0.35]])
        img[m] = color_mask
    ax.imshow(img)

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from dawat_generator_withBucket import AutomaticMaskGenerator
from dawat_objectstorage import ObjectStorageSample
from s3_operations import create_bucket, create_folder, upload_file, list_objects
from PIL import Image
import os
import boto3

app = FastAPI()


#CORS setting
origins = [
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:3000",
    # Example frontend development server
    # Add more allowed origins as needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ImageInfo(BaseModel):
    #width: int
    #height: int
    file_name: str
    
class TestInfo(BaseModel):
    bucket_name: str
    folder_name: str
    object_name: str
    source_file_path: str

image_id_counter = 1


@app.post("/upload/image/dawat")
async def upload_image(file: UploadFile = File(...)):
    # 이미지 파일의 원래 이름을 얻어옵니다.
    file_name = file.filename

    # 이미지 파일을 저장할 경로를 지정합니다 (workspace/data 디렉토리에 저장합니다).
    save_path = os.path.join("data", file_name)

    # 이미지 파일을 저장합니다.
    with open(save_path, "wb") as image_file:
        image_file.write(file.file.read())

    # 성공적으로 저장되었음을 응답으로 반환합니다.
    return {"status": "ok", "message": f"File {file_name} uploaded and saved successfully"}

@app.post("/process_stored_image/dawat")
async def process_stored_image(image_info: ImageInfo):
    global image_id_counter
    file_name = image_info.file_name
    
    # Read the stored image from the data directory
    file_path = os.path.join("data", file_name)
    with open(file_path, "rb") as f:
        #image = f.read()
        image = Image.open(f)
    
    # Extract parameters from the image_data dictionary
    #width = image.shape[1]               #width
    #height = image.shape[0]              #height
    
    # Get image width and height
    width, height = image.size
    
    
    image_id = image_id_counter
    

    # Process the image using the model
    #시작지점
    #sam_checkpoint = "sam_vit_h_4b8939.pth"
    sam_checkpoint = "sam_vit_b_01ec64.pth"
    generator = AutomaticMaskGenerator(sam_checkpoint, model_type="vit_b", device="cuda")
    generator.generate_masks("data/" + image_info.file_name, image_info.file_name)
    
    with open("output.json", "r") as json_file:
        result_data = json.load(json_file)
    
    
    # Prepare the response data
    response_data = {
        "Image": {
            "image_id": image_id,
            "width": width,
            "height": height,
            "file_name": file_name,
        },
        "annotation": result_data
    }
    image_id_counter += 1
    
    return response_data

    #process 이미지 처리마무리(generator 코드 추가) / 인자로 image_heigh,width 받는거 x -> 해결o
    
    #bucket저장코드 추가
    
    #cuda로 바꾸거나 pth 좀 더 작은 모델 써보기

@app.get("/get_bucket/{bucket_name}")
async def create_bucket(bucket_name: str):
    sample = ObjectStorageSample()

    try:
        return sample.list_objects(bucket_name)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        

@app.post("/put_bucket")
async def put_bucket(test_info: TestInfo):
    sample = ObjectStorageSample()
    bucket_name =  test_info.bucket_name
    folder_name = test_info.folder_name
    object_name =  test_info.object_name
    source_file_path =  test_info.source_file_path
    
    try:
        sample.put_object(bucket_name, folder_name, object_name, source_file_path)
        return {"OK"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/upload/pdf/dawat")
async def upload_image(file: UploadFile = File(...)):
    pdfgenerator = PDFGenerator()
    
    #파일의 원래 이름을 얻어옵니다.
    file_name = file.filename

    #파일을 저장할 경로를 지정합니다 (workspace/data 디렉토리에 저장합니다).
    save_path = os.path.join("pdfdata", file_name)

    # 이미지 파일을 저장합니다.
    with open(save_path, "wb") as pdf_file:
        pdf_file.write(file.file.read())

    result = pdfgenerator.generate_pdfs(save_path, file_name)

    return result