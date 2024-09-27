import fitz
import re

class readPDF:
    def __init__(self, file):
        self.text = ""
        self.file = file
        self.items = {
            "Nombre": "",
            "Contexto": "",
            "Productos": "",
            "Extra": "",
            "Rutas": ""
        }
        self.keys = list(self.items.keys())

        self.getText()
        self.cleanText()

    def getText(self):
        with fitz.open(self.file) as f:
            for page in f:
                self.text += page.get_text()

    def cleanText(self):
        self.text = self.text.replace("\n", " ")
        rawList = self.text.split("#")[1:][1::2][1:]

        if len(rawList) != len(self.keys):
            raise Exception(f"Text len does not match keys len (keys{len(self.keys)} != text:{len(rawList)})")
        
        for i in range(len(rawList)):
            self.items[self.keys[i]] = re.sub(r'\s+', ' ',":".join(rawList[i].strip().split(":")[1:]))