// pages/api/posts/create.ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
        const posts = await prisma.post.findMany();
        res.status(200).json(posts);
        } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Internal Server Error' });
        }
    } else
  if (req.method === 'POST') {
    try {
      const { subject, detail, atkResult, userId, photo } = req.body;

      // Handle the file upload, for example, saving the photo to your server or cloud storage
      let photoUrl = '';
      if (photo) {
        // Save the photo to your storage and get the URL
        // Example: Assuming you're saving the photo on your server and providing the path
        const photoPath = path.join(__dirname, 'uploads', photo.filename); // Just an example
        fs.writeFileSync(photoPath, photo.buffer); // Store the photo locally
        photoUrl = `/uploads/${photo.filename}`; // Return the path or a URL if using a storage service
      }

      // Create the Post in the database
      const newPost = await prisma.post.create({
        data: {
          subject,
          detail,
          atkResult,
          userId,
          photo: photoUrl, // Store the file URL in the photo field
        },
      });

      res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
