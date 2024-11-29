from openai import OpenAI
import time

class vectorStorage:
    def __init__(self, api_key : str):
        self.client = OpenAI(api_key=api_key)

    def createStorage(self, name : str):
        id = self.checkStorageExistance(name)
        if id != "":
            result = self.client.beta.vector_stores.retrieve(vector_store_id=id)
            print("already existant")
            return result.id
        storage = self.client.beta.vector_stores.create(
            name=f"{name} storage"
        )
        return storage.id
    
    def checkStorageExistance(self, name : str):
        storage = self.client.beta.vector_stores.list()
        for x in storage.data:
            if (x.name == name):
                return x.id
        
        return ""
    
    def deleteStorage(self, id : str):
        storageFiles = self.client.beta.vector_stores.files.list(
            vector_store_id=id
        )

        for x in storageFiles.data:
            self.client.files.delete(
                file_id=x.id
            )

        self.client.beta.vector_stores.delete(
            vector_store_id=id
        )

    def uploadFile(self, name, storage):
        if ".txt" not in name:
            return False
        
        file = self.client.files.create(
            file=open(f"documents/{name}", "rb"),
            purpose="assistants"
        )

        self.client.beta.vector_stores.files.create(
            vector_store_id=storage,
            file_id=file.id
        )
        return True
    
    def listFiles(self, storage):
        storageFiles = self.client.beta.vector_stores.files.list(
            vector_store_id=storage
        )
        files = []
        for x in storageFiles.data:
            file = self.client.files.retrieve(
                file_id=x.id
            )
            files.append({"name": file.filename, "id": file.id})

        return files
    
    def deleteFile(self, storage, file):
        self.client.beta.vector_stores.files.delete(
            vector_store_id=storage,
            file_id=file
        )

        self.client.files.delete(
            file_id=file
        )

    def fileContent(self, file):
        content = self.client.files.content(file_id=file)
        return content