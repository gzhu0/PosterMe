interface ImageStorageResponse {
  success: boolean;
  filePath?: string;
  error?: string;
}

class ImageStorageService {
  private static instance: ImageStorageService;
  private capturedImages: string[] = [];
  private readonly API_URL = 'http://localhost:3001/api';

  private constructor() {}

  public static getInstance(): ImageStorageService {
    if (!ImageStorageService.instance) {
      ImageStorageService.instance = new ImageStorageService();
    }
    return ImageStorageService.instance;
  }

  public async storeImage(base64Image: string): Promise<ImageStorageResponse> {
    try {
      console.log('Storing image...');
      
      // Add the image to our in-memory storage
      this.capturedImages.push(base64Image);

      // Convert base64 to blob
      const base64Data = base64Image.split(',')[1];
      const blob = await fetch(`data:image/jpeg;base64,${base64Data}`).then(res => res.blob());

      // Create form data
      const formData = new FormData();
      formData.append('photo', blob, 'photo.jpg');

      // Send the image to our backend server
      console.log('Sending image to server...');
      const response = await fetch(`${this.API_URL}/photos`, {
        method: 'POST',
        body: formData,
      });

      console.log('Server response received');
      const result = await response.json();
      console.log('Server response:', result);

      if (!result.success) {
        throw new Error(result.error || 'Failed to save photo');
      }

      return {
        success: true,
        filePath: result.filePath
      };
    } catch (error) {
      console.error('Error storing image:', error);
      return {
        success: false,
        error: 'Failed to store image'
      };
    }
  }

  public getStoredImages(): string[] {
    return this.capturedImages;
  }

  public removeImage(index: number): void {
    this.capturedImages = this.capturedImages.filter((_, i) => i !== index);
  }
}

export const imageStorageService = ImageStorageService.getInstance(); 