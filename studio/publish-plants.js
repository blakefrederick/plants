import {getCliClient} from 'sanity/cli'

// Get all draft plant documents and publish them
const client = getCliClient()

async function publishPlants() {
  try {
    // Find all draft plants
    const draftPlants = await client.fetch('*[_type == "plant" && _id match "drafts.*"]')
    
    console.log(`Found ${draftPlants.length} draft plants to publish`)
    console.log('Draft IDs:', draftPlants.map(p => p._id))
    
    const mutations = draftPlants.map(plant => {
      const publishedId = plant._id.replace('drafts.', '')
      console.log(`Publishing ${plant._id} -> ${publishedId}`)
      return {
        createOrReplace: {
          ...plant,
          _id: publishedId
        }
      }
    })
    
    if (mutations.length > 0) {
      console.log('Executing mutations...')
      const result = await client.mutate(mutations)
      console.log(`Successfully published ${mutations.length} plants!`)
      
      // Now delete the drafts
      const deleteOps = draftPlants.map(plant => ({
        delete: { id: plant._id }
      }))
      
      console.log('Deleting draft versions...')
      await client.mutate(deleteOps)
      console.log('Draft versions deleted')
      
    } else {
      console.log('No draft plants found to publish')
    }
    
  } catch (error) {
    console.error('Error publishing plants:', error)
  }
}

publishPlants()