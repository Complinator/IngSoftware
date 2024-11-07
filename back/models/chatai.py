from openai import OpenAI
import time

class chatAI:
    def __init__(self, api_key : str):
        self.client = OpenAI(api_key=api_key)

    def generatePrompt(self, items : dict):
        prompt = ""
        prompt += f'''
            Eres el chatbot de una empresa y tu fin principal es la atención al cliente dentro de una página web, la idea es que respondas preguntas al usuario de una manera breve, fácil de entender y, 
            por sobre todo, muy explicita a modo de facilitar el viaje del usuario dentro de la página y mejorar el entendimiento de este sobre la empresa. A continuación habrán unos apartados que guiarán
            como será tu interacción con el usuario:
            # CONTEXTO #
            Trabajarás sobre la empresa {items["Nombre"]}, a continuación, un breve contexto de la empresa: {items["Contexto"]}\n
        '''
        if not (items["Productos"] == "" or items["Productos"].isspace()):
            prompt += f'''
                # PRODUCTOS #
                A continuación, se enumera una serie de productos (o servicios) brindados por la empresa (en caso de estar vacío, ignorar): {items["Productos"]}\n
            '''

        if not (items["Extra"] == "" or items["Extra"].isspace()):
            prompt += f'''
                # DATOS EXTRA #
                En esta sección se añadirán información adicional a tomar en cuenta a la hora de responder al usuario (en caso de estar vacío, ignorar): {items["Extra"]}\n
            '''

        prompt += '''
            # RESPUESTA #
            El tono de la respuesta debe ser claro y preciso, evita palabras redundantes. Es de suma importancia que la respuesta sea directo al grano y muy explícita para evitar confusiones y no llenar al cliente de información innecesaria.
            La repuesta que debes dar debe ser en formato de texto, ten en cuenta que, al ser un chatbot, el texto que debes de responder jamas puede estar punteado, pues debe de ser en un formato que
            parezca como una conversación. un ejemplo de esto es:
            Usuario: "Me podrías explicar un poco la misión de la empresa?"
            Asistente: "Claro! la empresa consiste en un..." (Nota que tu respuesta jamas fue separada en secciones, sino que fue puesta como un parrafo de texto, tal y como en una conversación de texto).
            Según las limitaciones establecidas mas adelantes, pueden haber casos donde el usuario haga una petición que va más alla de los limites establecidos dentro de tu contexto como chatbot, en ese caso
            responde simplemente con un texto del tipo "Lo siento, pero no puedo cumplir con esa solicitud. Si tienes alguna otra pregunta o necesitas ayuda con algo más, ¡estaré encantado de ayudarte!".
            Por otra parte, puede suceder que la petición del usuario, si bien tenga relación con la empresa o esta dentro de los limites establecidos, no cuentas con la información suficiente para otorgar una respuesta
            determinística, en dicho caso responde con un mensaje del tipo "Lo siento, pero no cuento con la información suficiente para cumplir con esa solicitud. No dudes en contactarte con el soporte técnico de la empresa para más información.".
            Cuando una consulta del usuario cumple con todas las limitaciones establecidas, entonces se le devuelve una respuesta con formato de texto tal y como se explicó antes, aún así, existe una
            posibilidad de que dentro de la respuesta sea necesario implementar una ruta (con ruta se hace referencia a que la consulta del usuario guarda una relación con alguna ruta en particular de la página web,
            en cuyo caso, mas adelante se detallará dentro del apartado RUTAS las redirecciones del usuario dentro de la página web. En caso de que existe, es importante, dentro de una consulta de usuario, 
            poder determinar cuales preguntas guardan relación con una ruta, por ejemplo, un usuario preguntando: "Dónde puedo conseguir mas información sobre los precios dentro de esta página?", o bien, una relación
            más indirecta del estilo: "Cuanto me cuesta x articulo?". En esos casos, para indicar la ruta solo inserta el nombre de la ruta en conjunto con la ruta en el formato {{nombre:ruta}}, por ejemplo,
            respondiendo a las anteriores preguntas de usuarios en orden: "Puedes encontrar información sobre los precios en esta página visitando {{Precios:/productos/precios}}", o bien "El articulo x 
            que estas buscando cuesta un total de ..., para más información, también puedes visitar {{Precios:/productos/precios}}").
            Reitero la importancia que es usar la información dispuesta en este mensaje y no inventarla.\n
        '''

        if not (items["Rutas"] == "" or items["Rutas"].isspace()):
            prompt += f'''
                # RUTAS #
                Esta seccion está dedicada principalmente a brindar información sobre la página web para poder guiar al usuario en la navegación dentro de la página. A continuación, se muestran todas las
                rutas de la página web en formato:
                - nombre:ruta (descripción)
                Un ejemplo de esto es (- Precios:/productos/precios (esta ruta contiene información sobre los precios de los productos))
                Lista de rutas (en caso de que este vacío, ignorar):
                {items["Rutas"]}\n
            '''

        prompt += '''
            # LIMITACIONES #
            - La unica información con la que puedes responder es la información dispuesta en el presente mensaje.
            - No puedes hacer asunciones respecto de cosas que no se te fueron dichas, pues esto puede llevar a desinformar al usuario
            - Debes limitarte a tan solo responder consultas del usuario con respecto a la página y/o organización (empresa) en cuestión (es decir, cualquier clase de pregunta que tenga relación con la información proporcionada)
            - Cualquier otra petición del usuario (pregunta sobre algún otro tópico, simulación, etc) debe ser rechazado cordialmente según los formatos de respuesta previamente especificados.
            - En caso de que la información dispuesta no sea suficiente, responder en base a los formatos de respuesta previamente especificados (no realizar asunciones).
            - La respuesta debe ser breve y precisa para que el usuario no deba de recibir tanta información innecesaria, sin embargo, tampoco debes de dejar de lado responder exitosamente la consulta del usuario.\n
        '''
        return prompt

    def createAssistant(self, name : str, prompt : str):
        
        assistant = self.client.beta.assistants.create(
            name=name,
            instructions=prompt,
            model="gpt-4o-mini",
            temperature=0,
        )
        return assistant.id
    
    def loadAssistant(self, id : str):
        assistant = self.client.beta.assistants.retrieve(
            assistant_id=id,
        )
        self.assistant = assistant
        return assistant.id
    
    def modifyAssistant(self):
        pass

    def listAssistant(self):
        assistants = []
        for assistant in self.client.beta.assistants.list().data:
            assistants.append({"id": assistant.id, "name": assistant.name})

        return assistants

    def removeAssistant(self, assistantid : str):
        self.client.beta.assistants.delete(
            assistant_id=assistantid,
        )
    
    def createThread(self):
        # thread = self.client.beta.threads.create()
        # return thread.id
    
        try:
            thread = self.client.beta.threads.create()  # Verifica que esta función sea válida
            return thread.id
        except Exception as e:
            print(f"Error creating thread: {e}")
            return None
            
    def createMessage(self,  content : str, tid : str):
        message = self.client.beta.threads.messages.create(
            thread_id=tid,
            role="user",
            content=content,
        )
        return message.id

    def runAssistant(self, tid : str, assistantid : str):
        run = self.client.beta.threads.runs.create(
            thread_id=tid,
            assistant_id=assistantid,
        )
        return run.id
    
    def retrieveAssistant(self, rid : str, tid : str):
        while True:
            run = self.client.beta.threads.runs.retrieve(thread_id=tid, run_id=rid)
            if run.status == "completed":
                messages = self.client.beta.threads.messages.list(thread_id=tid)
                latest_message = messages.data[0]
                text = latest_message.content[0].text.value
                return text
            elif run.status == "failed":
                return "An error occurred while processing your request."
            time.sleep(1)
    
    def retrieveMessages(self, tid : str):
        messages = self.client.beta.threads.messages.list(thread_id=tid)
        # Sort messages by 'created_at' to maintain chronological order
        sorted_messages = sorted(messages, key=lambda msg: msg.created_at)

        # Collect message-response pairs with IDs
        message_response_pairs = []
        current_message = None
        current_message_id = None

        for message in sorted_messages:
            if message.role == 'user':
                current_message = message.content[0].text.value  # Store user message text
                current_message_id = message.id  # Store user message ID
            elif message.role == 'assistant' and current_message:
                # Pair with assistant response if there's a current user message
                assistant_response = message.content[0].text.value
                message_response_pairs.append({
                    "id": current_message_id, 
                    "message": current_message, 
                    "response": assistant_response
                })
                current_message = None  # Reset for the next pair
                current_message_id = None  # Reset ID for the next pair

        return message_response_pairs
    
