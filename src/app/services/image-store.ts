import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

export interface StoredImage {
  url: string;
  prompt: string;
}

interface DbSchema {
  images: StoredImage[];
}

class ImageStore {
  private db: Low<DbSchema>;

  constructor() {
    const adapter = new JSONFile<DbSchema>('db.json');
    this.db = new Low(adapter, { images: [] });
  }

  async addImage(url: string, prompt: string) {
    await this.db.read();
    this.db.data.images.push({ url, prompt });
    await this.db.write();
  }

  async getImages(): Promise<StoredImage[]> {
    await this.db.read();
    return this.db.data.images;
  }
}

export const imageStore = new ImageStore();