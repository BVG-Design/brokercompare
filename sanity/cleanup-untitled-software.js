import { getCliClient } from 'sanity/cli'

const client = getCliClient()

async function run() {
    console.log('Searching for untitled software documents...')

    // Find software docs with no title or empty title
    // Also excluding drafts to avoid confusion, or handle them specifically? 
    // Usually we want to clean everything.
    const docs = await client.fetch(`
    *[_type == "software" && (!defined(title) || title == "")] {
      _id,
      title
    }
  `)

    if (!docs.length) {
        console.log('✅ No untitled software documents found.')
        return
    }

    console.log(`🧹 Found ${docs.length} untitled documents:`)
    docs.forEach(d => console.log(`- ${d._id}`))

    // Delete them
    const transaction = client.transaction()
    docs.forEach(d => transaction.delete(d._id))

    await transaction.commit()
    console.log('✅ Untitled software documents deleted safely.')
}

run().catch(err => {
    console.error('Error running cleanup:', err)
    process.exit(1)
})
