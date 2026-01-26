import clientPromise from '../../lib/mongodb'
import { ObjectId } from 'mongodb'

export default async function handler(req, res) {
  const client = await clientPromise
  const db = client.db('csesixthsem')
  const collection = db.collection('announcements')

  if (req.method === 'GET') {
    const announcements = await collection.find({}).sort({ dueDate: 1 }).toArray()
    res.status(200).json(announcements)
  } else if (req.method === 'POST') {
    const { title, body, allotmentDate, dueDate, priority } = req.body
    if (!title || !body || !allotmentDate || !dueDate || !priority) {
      return res.status(400).json({ error: 'Missing fields' })
    }
    const result = await collection.insertOne({ title, body, allotmentDate, dueDate, priority })
    res.status(201).json({ insertedId: result.insertedId })
  } else if (req.method === 'DELETE') {
    const { id } = req.body
    if (!id) return res.status(400).json({ error: 'Missing id' })
    await collection.deleteOne({ _id: new ObjectId(id) })
    res.status(200).json({ success: true })
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}