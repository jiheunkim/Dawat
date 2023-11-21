import cv2
import numpy as np
import json
import sys
sys.path.append("..")
from dawat_objectstorage import ObjectStorageSample
import os
import boto3
import fitz
from typing import List
from urllib.parse import quote

class PDFGenerator:
    def __init__(self):
        self.filename = None
        
    def generate_pdfs(self, file_path, filename):
        self.filename = filename

        #mask_generator = SamAutomaticMaskGenerator(self.sam)
        #masks = mask_generator.generate(image)
        #여기서 부터 시작이네
        sample = ObjectStorageSample()
        
        
        endpoint_url = 'https://kr.object.ncloudstorage.com'
        bucket_name = 'dawatpdf'
        
        data = {}
        
        doc = fitz.open(file_path)
        for i, page in enumerate(doc):
            img = page.get_pixmap()
            img.save(f"./data/{self.filename}_{i}.png")
            #여기에 제목 추가
        
            #directory path
            file_name = self.filename
            cleaned_filename = file_name.replace(" ", "")
            # Encode Korean characters in the filename
            encoded_filename = quote(cleaned_filename)

            #directory_path = f'{endpoint_url}/{bucket_name}/{encoded_filename}/pdfdata'
            local_file_path = f"data/{encoded_filename}_{i}.png" #i로 바꿔야하는디?
            #f"masks/mask_{idx}.png"
            #얘까지 수정

            sample.put_object('dawatpdf', encoded_filename, f'{encoded_filename}_{i}.png', local_file_path)
            #masktest성공하면 masktest -> masks로 변경(image url 따라가야함)
            #put_object(self, bucket_name, folder_name, object_name, source_file_path, request_parameters=None)

            data[i] = {
                "title": f'{self.filename}_{i}.png',
                "url": f'{endpoint_url}/{bucket_name}/{encoded_filename}/{encoded_filename}_{i}.png'
            }
    
    
        #json_data = json.dumps(data, default=json_converter, indent=4)
        #with open("output.json", "w", encoding="utf-8") as f:
        #    f.write(json_data)
        
        
        # JSON 데이터 utf-8로 encode
        #data = json_data.encode('utf-8')
        #with open('output.json', 'r') as file:
        #    data = json.load(file)
        
        #여기있었음
        
        
        def json_converter(obj):
            if isinstance(obj, np.ndarray):
                return obj.tolist()
            raise TypeError(f"Object of type {obj.__class__.__name__} is not JSON serializable")

        # JSON 데이터 업데이트 및 저장
        json_data = json.dumps(data, default=json_converter, indent=4)
        json_path = f'json/{self.filename}_output.json'
        with open(json_path, "w", encoding="utf-8") as f:
            f.write(json_data)
            
        with open(json_path, "r") as json_file:
            result_data = json.load(json_file)

        return result_data