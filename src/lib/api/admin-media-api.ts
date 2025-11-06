import { STRAPI_BASEURL } from '@/lib/constants'
import { Image } from '@/types/image'

export async function uploadImage(
  jwt: string,
  file: File
): Promise<Image | null> {
  const headers = {
    'Authorization': `Bearer ${jwt}`,
  }

  const formData = new FormData()
  formData.append('files', file)
  formData.append('fileInfo', JSON.stringify({
    alternativeText: file.name,
    caption: file.name,
  }))

  try {
    const response = await fetch(
      `${STRAPI_BASEURL}/api/upload`,
      {
        method: 'POST',
        headers,
        body: formData,
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Failed to upload image')
    }

    const data = await response.json() as Image[]
    return data[0] || null
  } catch (error) {
    console.error('Error uploading image:', error)
    throw error
  }
}

export async function deleteImage(
  jwt: string,
  id: number
): Promise<boolean> {
  const headers = {
    'Authorization': `Bearer ${jwt}`,
    'Content-Type': 'application/json',
  }

  try {
    const response = await fetch(
      `${STRAPI_BASEURL}/api/upload/files/${id}`,
      {
        method: 'DELETE',
        headers,
      }
    )

    if (!response.ok) {
      throw new Error('Failed to delete image')
    }

    return true
  } catch (error) {
    console.error('Error deleting image:', error)
    throw error
  }
}

