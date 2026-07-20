export interface FileStorageProvider {
  /**
   * Uploads a file and returns its public URL
   */
  upload(file: File): Promise<string>;
  
  /**
   * Deletes a file by its URL or ID
   */
  delete(url: string): Promise<void>;
  
  /**
   * Gets a public URL for a given ID or path
   */
  getUrl(path: string): Promise<string>;
}

export class MockStorageService implements FileStorageProvider {
  public async upload(file: File): Promise<string> {
    // In a real implementation (e.g. AWS S3, Cloudinary), this would make a network request.
    // For now, we simulate an upload delay and return a local blob URL.
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(URL.createObjectURL(file));
      }, 1500);
    });
  }

  public async delete(url: string): Promise<void> {
    // Simulate deletion
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 500);
    });
  }

  public async getUrl(path: string): Promise<string> {
    return path;
  }
}

// Export a singleton instance of the current provider
// This makes it extremely easy to swap out `MockStorageService` with `CloudinaryStorageService` later
export const storageService: FileStorageProvider = new MockStorageService();
