import clientPromise from '../../lib/mongodb'

export default async function handler(req, res) {
  const client = await clientPromise
  const db = client.db('csesixthsem')
  const collection = db.collection('notes')

  if (req.method === 'GET') {
    const { search } = req.query
    
    // If search query exists, perform search
    if (search) {
      const searchRegex = new RegExp(search, 'i') // Case-insensitive search
      const notes = await collection.find({
        $or: [
          { folder: searchRegex },
          { linkText: searchRegex },
          { link: searchRegex }
        ]
      }).toArray()
      return res.status(200).json(notes)
    }
    
    // Return all notes/folders/links as a flat list
    const notes = await collection.find({}).toArray()
    res.status(200).json(notes)
    
  } else if (req.method === 'POST') {
    // Accept: { folder, link, linkText, parentId, type }
    // type: 'folder' | 'subfolder' | 'link'
    const { folder, link, linkText, parentId, type } = req.body
    if (!type || (type === 'folder' && !folder) || (type === 'subfolder' && (!folder || !parentId)) || (type === 'link' && (!link || !parentId))) {
      return res.status(400).json({ error: 'Missing fields' })
    }
    const doc = { type, folder, link, linkText, parentId: parentId || null }
    const result = await collection.insertOne(doc)
    res.status(201).json({ insertedId: result.insertedId })
    
  } else if (req.method === 'DELETE') {
    const { id } = req.body
    if (!id) return res.status(400).json({ error: 'Missing id' })
    await collection.deleteOne({ _id: new (require('mongodb').ObjectId)(id) })
    res.status(204).end()
    
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}