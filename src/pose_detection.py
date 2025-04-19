import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

model_path = 'PosterMe\\src\\models\\pose_landmarker_lite.task'

def findVector(image):
    '''
        image: path to image OR numpyp image
        -> vectorization of image
    '''
    BaseOptions = mp.tasks.BaseOptions
    PoseLandmarker = mp.tasks.vision.PoseLandmarker
    PoseLandmarkerOptions = mp.tasks.vision.PoseLandmarkerOptions
    VisionRunningMode = mp.tasks.vision.RunningMode

    options = PoseLandmarkerOptions(
        base_options=BaseOptions(model_asset_path=model_path),
        running_mode=VisionRunningMode.IMAGE)

    with PoseLandmarker.create_from_options(options) as landmarker:

        #Image input from file
        mp_image = mp.Image.create_from_file('/path/to/image')
        #Image input from numpy array (for movies)
        #mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=numpy_image)

        pose_landmarker_result = landmarker.detect(mp_image)





