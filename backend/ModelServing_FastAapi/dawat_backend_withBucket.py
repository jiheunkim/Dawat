import numpy as np
import torch
import matplotlib.pyplot as plt
import cv2
import json
import os
import boto3
import time
import fitz
from datetime import datetime
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
from rle_generator import AutomaticMaskGenerator
from pdfgenerator import PDFGenerator
from dawat_objectstorage import ObjectStorageSample
from PIL import Image


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
    file_name: str
    
class TestInfo(BaseModel):
    bucket_name: str
    folder_name: str
    object_name: str
    source_file_path: str

image_id_counter = 1

current_datetime = datetime.now()
# 원하는 형식으로 포맷팅
formatted_datetime = current_datetime.strftime("%y%m%d-%H:%M:%S")


@app.post("/upload/image/dawat")
async def upload_image(file: UploadFile = File(...)):
    # 이미지 파일의 원래 이름을 얻어옵니다.
    file_name = file.filename
    
    file_name = file_name.replace(" ", "")

    # 이미지 파일을 저장할 경로를 지정합니다 (workspace/data 디렉토리에 저장합니다).
    save_path = os.path.join("data", file_name)

    # 이미지 파일을 저장합니다.
    with open(save_path, "wb") as image_file:
        image_file.write(file.file.read())

    # 성공적으로 저장되었음을 응답으로 반환합니다.
    return {"status": "ok",
            "file_name": file_name,
            "message": f"File {file_name} uploaded and saved successfully"}

@app.post("/process_stored_image/dawat")
async def process_stored_image(image_info: ImageInfo):
    global image_id_counter
    file_name = image_info.file_name
    file_name = file_name.replace(" ", "")
    
    #unique id 생성과정
    unique_id = f"{formatted_datetime}_{image_id_counter}"
    
    # Read the stored image from the data directory
    file_path = os.path.join("data", file_name)
    with open(file_path, "rb") as f:
        #image = f.read()
        image = Image.open(f)
    
    # Get image width and height
    width, height = image.size
    
    
    image_id = image_id_counter
    
    json_path = f'json/{image_info.file_name}_output.json'
    #json 저장 수정 끝부분
    
    
    # Check if JSON file already exists for the given image
    if os.path.exists(json_path):
        with open(json_path, "r") as json_file:
            result_data = json.load(json_file)
            
        return result_data
    

    # Process the image using the model #시작지점
    #sam_checkpoint = "sam_vit_h_4b8939.pth"
    sam_checkpoint = "sam_vit_b_01ec64.pth"
    generator = AutomaticMaskGenerator(sam_checkpoint, model_type="vit_b", device="cuda")
    result_data = generator.generate_masks("data/" + image_info.file_name, image_info.file_name)
    
    
    # Prepare the response data
    response_data = {
        "Image": {
            "image_id": unique_id,
            "width": width,
            "height": height,
            "file_name": file_name,
        },
        "annotation": result_data
    }
    image_id_counter += 1
    
    # JSON 변환 함수
    def json_converter(obj):
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        raise TypeError(f"Object of type {obj.__class__.__name__} is not JSON serializable")
    
    json_data = json.dumps(response_data, default=json_converter, indent=4)
    json_path = f'json/{image_info.file_name}_output.json'
    with open(json_path, "w", encoding="utf-8") as f:
        f.write(json_data)
    
    return response_data

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

        
#여기부터 추가됨(이 위가 원래 rle코드)
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

#title 구현 시작
class UpdateKeyRequest(BaseModel):
    image_name: str
    old_key: str
    new_key: str

class DeleteKeyRequest(BaseModel):
    image_name: str
    id : int
    
class AddKeyRequest(BaseModel):
    image_name: str
    new_key: str


@app.post("/update_key")
async def update_key(request_data: UpdateKeyRequest):
    imagename = request_data.image_name
    # JSON 파일 경로
    json_file_path = f"json/{imagename}_output.json"

    # JSON 파일 읽기
    with open(json_file_path, "r") as file:
        data = json.load(file)
    
    #new_key 존재확인, 중복될경우 error반환
    if "annotation" in data and request_data.new_key in data["annotation"]:
        raise HTTPException(status_code=400, detail=f"Key '{request_data.new_key}' already exists in 'annotation'")

    # old_key가 존재하는지 확인하고, 존재하면 new_key로 변경
    if "annotation" in data and request_data.old_key in data["annotation"]:
        data["annotation"][request_data.old_key] = data["annotation"].pop(request_data.old_key)
        data["annotation"][request_data.old_key]["title"] = request_data.new_key

        # 변경된 데이터를 다시 파일에 쓰기
        with open(json_file_path, "w") as file:
            json.dump(data, file, indent=4)

        return data
    else:
        raise HTTPException(status_code=404, detail=f"Key '{request_data.old_key}' not found in the JSON file")
        
@app.post("/delete_key")
async def delete_key(request_data: DeleteKeyRequest):
    imagename = request_data.image_name
    # JSON 파일 경로
    json_file_path = f"json/{imagename}_output.json"

    # JSON 파일 읽기
    with open(json_file_path, "r") as file:
        data = json.load(file)
        
        
    # annotation이라는 key가 있는지 확인
    if "annotation" in data:
        # id를 통해 annotation_0, annotation_1 등을 판단
        annotation_key = f"annotation_{request_data.id}"

        # 해당하는 annotation이 있는지 확인하고 있다면 삭제
        if data["annotation"][annotation_key]["id"] == request_data.id:
            del data["annotation"][annotation_key]
            
            # 변경된 데이터를 다시 파일에 쓰기
            with open(json_file_path, "w") as file:
                json.dump(data, file, indent=4)
        
            return data
    else:
        raise HTTPException(status_code=404, detail=f"Key '{request_data.old_key}' not found in the JSON file")
        

@app.post("/add_key")
async def add_key(request_data: AddKeyRequest):
    imagename = request_data.image_name
    # JSON 파일 경로
    json_file_path = f"json/{imagename}_output.json"

    # JSON 파일 읽기
    with open(json_file_path, "r") as file:
        data = json.load(file)

    # new_key가 이미 존재하는지 확인하고, 중복된다면 에러 반환
    if "annotation" in data and request_data.new_key in data["annotation"]:
        raise HTTPException(status_code=400, detail=f"Key '{request_data.new_key}' already exists in 'annotation'")

    # 새로운 키 추가
    data["annotation"][request_data.new_key] = {}
    data["annotation"][request_data.new_key]["title"] = request_data.new_key
    

    # 변경된 데이터를 다시 파일에 쓰기
    with open(json_file_path, "w") as file:
        json.dump(data, file, indent=4)

    return {"message": f"Key '{request_data.new_key}' successfully added to 'annotation'"}
#title 구현완료

#태그 구현 시작
class AddTagsRequest(BaseModel):
    image_name: str
    id: int
    tags: str
    
class DeleteTagRequest(BaseModel):
    image_name: str
    annotation: str
    tag: str

@app.post("/update_tags")
async def add_tags(request_data: AddTagsRequest):
    imagename = request_data.image_name
    # id를 통해 annotation_0, annotation_1 등을 판단
    annotation_key = f"annotation_{request_data.id}"
    #annotation = request_data.annotation
    # JSON 파일 경로
    json_file_path = f"json/{imagename}_output.json"

    # JSON 파일 읽기
    with open(json_file_path, "r") as file:
        data = json.load(file)
        
    # tag 키가 없으면 생성
    if "annotation" in data and "tag" not in data["annotation"][annotation_key]:
        data["annotation"][annotation_key]["tag"] = {}
        
    #수정시작
    # annotation이라는 key가 있는지 확인
    if "annotation" in data:
        

        # 해당하는 annotation이 있는지 확인하고 있다면 삭제
        if data["annotation"][annotation_key]["id"] == request_data.id:
            data["annotation"][annotation_key]["tag"] = request_data.tags
            
            # 변경된 데이터를 다시 파일에 쓰기
            with open(json_file_path, "w") as file:
                json.dump(data, file, indent=4)
        
            return data