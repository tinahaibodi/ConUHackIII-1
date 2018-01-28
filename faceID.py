import base64

from clarifai.rest import ClarifaiApp
from clarifai.rest import FeedbackInfo
from clarifai.rest import Region, RegionInfo, BoundingBox, Concept
from clarifai.rest import Face, FaceIdentity
from clarifai.rest import FaceAgeAppearance, FaceGenderAppearance, FaceMulticulturalAppearance
import json
from flask import Flask, jsonify, render_template, request
appF = Flask(__name__)
appF.debug = True

api_key='b94be44e179d4f02a70df9403250edea'
app = ClarifaiApp(api_key=api_key)


#TODO: replace sth by the proper format
@appF.route("/demo_test.asp", methods=['POST'])
def train():
  image = request.files['image']
  image_string = base64.b64encode(image.read())
  images = [image_string]
  idd = '666'

  if app.models.search(idd) is None:

    for image in images:
      print('training')
      # import pdb; pdb.set_trace()
      app.inputs.create_image_from_base64(image, concepts=[idd])
      model = app.models.create(model_id=idd, concepts=[idd])
      model.train()
      return 'succes'
  else:
    print('unlocking')
    unlocked = unlock(images[0],idd)
    print(unlocked)
    if (unlocked):
      return 'success'
    return 'failure'



def predict(image, idd):
  model = app.models.get(idd)
  return model.predict_by_base64(image)['outputs'][0]['data']['concepts'][0]['value']

def unlock(image, idd):
  print('predicting ', image)
  if predict(image, idd) > 0.9:
    return True
  return False


def test():
  train_images = ['Amir'+str(i)+'.jpg' for i in range(1,11)]
  idd = 'amir'
  #model = train(train_images,idd)
  neg_test_images = ['NotAmir'+str(i)+'.jpg' for i in range(1,7)]
  pos_test_images = ['Amir11.jpg', 'amir_test1.jpg']
  for img in neg_test_images:
    #print(img)
    if unlock(img,idd):
      print('NOT ACCURATE ENOUGH!!!')
    else:
      print('WE ARE GOOD!')
  for img in pos_test_images:
    if unlock(img, idd):
      print('Welcome!')
    else:
      print('I am the right person!')

if __name__ == '__main__':
  appF.run(host='localhost')
'''
#app = ClarifaiApp(api_key=api_key)

model = app.models.get('face_id')

model.send_region_feedback(input_id='id2', url='https://developer.clarifai.com/static/images/model-samples/celeb-001.jpg',
                       regions=[Region(region_info=RegionInfo(bbox=BoundingBox(top_row=0.1,
                                                                               left_col=0.2,
                                                                               bottom_row=0.5,
                                                                               right_col=0.5)),
                                       face=Face(identity=FaceIdentity([Concept(concept_id='celeb1', value=True)]))
                                       )
                                ],
                       feedback_info=FeedbackInfo(output_id='OID',
                                                  session_id='SID',
                                                  end_user_id='UID',
                                                  event_type='annotation'))

print(
  model.predict_by_filename(filename='notAmir7.jpg')['outputs'][0]['data']['concepts']
  )

print(
  model.predict_by_filename(filename='notAmir_test1.jpg')['outputs'][0]['data']['concepts']
  )

print(
  model.predict_by_filename(filename='notAmir1.jpg')['outputs'][0]['data']['concepts']
  )

print(
  model.predict_by_filename(filename='notAmir3.jpg')['outputs'][0]['data']['concepts']
  )
'''

