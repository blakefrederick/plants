import React, {useState} from 'react'
import {ArrayOfObjectsInputProps, set, unset, useClient, useFormValue} from 'sanity'
import {Button, Card, Flex, Stack, Text, useToast} from '@sanity/ui'
import {DownloadIcon, AddIcon} from '@sanity/icons'
import {IMAGE_API_CONFIG, RATE_LIMIT_CONFIG} from '../actions/config'

export function ImagesInputWithFetch(props: ArrayOfObjectsInputProps) {
  const {onChange, value = [], renderDefault} = props
  const client = useClient({apiVersion: '2024-01-01'})
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()
  
  // Get plant name and scientific name from the form
  const formDocument = useFormValue([]) as any
  const plantName = formDocument?.name
  const scientificName = formDocument?.scientificName

  const handleFetchImage = async () => {
    if (!plantName) {
      toast.push({
        status: 'warning',
        title: 'Plant name required',
        description: 'Please add a plant name before fetching images.'
      })
      return
    }

    setIsLoading(true)
    
    try {
      const imageAsset = await fetchPlantImage(plantName, scientificName, client)
      
      if (imageAsset) {
        // Create new image object
        const newImage = {
          _type: 'image',
          _key: `img-${Date.now()}`,
          asset: {
            _type: 'reference',
            _ref: imageAsset._id
          },
          alt: `${plantName}${scientificName ? ` (${scientificName})` : ''} - Auto-fetched plant image`,
          caption: `Auto-fetched from Pexels for ${plantName}`
        }
        
        // Add to the images array
        const updatedImages = [...(value || []), newImage]
        onChange(set(updatedImages))
        
        toast.push({
          status: 'success',
          title: 'Success! 🌿',
          description: `Added new plant image for "${plantName}"`
        })
      } else {
        toast.push({
          status: 'warning',
          title: 'No image found',
          description: `Couldn't find a suitable image for "${plantName}". Try a different search term.`
        })
      }
    } catch (error) {
      console.error('Error fetching image:', error)
      toast.push({
        status: 'error',
        title: 'Error fetching image',
        description: 'Failed to fetch image. Please check your connection and try again.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Stack space={3}>
      {/* Default array input rendering */}
      {renderDefault(props)}
      
      {/* Custom fetch button */}
      <Card padding={3} border style={{borderStyle: 'dashed'}}>
        <Flex align="center" justify="space-between">
          <Text size={1} muted>
            Auto-fetch plant images from free APIs 
          </Text>
          <Button
            icon={DownloadIcon}
            text="Fetch Plant Image"
            tone="primary"
            mode="ghost"
            onClick={handleFetchImage}
            disabled={isLoading || !plantName}
            loading={isLoading}
          />
        </Flex>
        {!plantName && (
          <Text size={1} muted style={{marginTop: '8px'}}>
            Add a plant name first to enable auto-fetch
          </Text>
        )}
      </Card>
    </Stack>
  )
}

/**
 * Fetch a plant image from Pexels API and upload to Sanity
 */
async function fetchPlantImage(plantName: string, scientificName?: string, client: any): Promise<any> {
  try {
    // Create comprehensive search queries
    const baseTerms = [
      scientificName ? `${scientificName} plant` : null,
      `${plantName} plant`,
      `${plantName} houseplant`,
      `${plantName} indoor plant`,
      plantName
    ].filter(Boolean)
    
    // Add fallback terms if no results
    const fallbackTerms = IMAGE_API_CONFIG.searchTerms.fallbacks
    const allSearchTerms = [...baseTerms, ...fallbackTerms]
    
    let imageData = null
    let attempts = 0
    const maxAttempts = Math.min(allSearchTerms.length, 8) // Limit attempts
    
    // Try different search terms with rate limiting
    for (const query of allSearchTerms) {
      if (attempts >= maxAttempts) break
      attempts++
      
      try {
        console.log('Searching for:', query, 'with API key:', IMAGE_API_CONFIG.pexels.apiKey ? 'Present' : 'Missing')
        
        const response = await fetch(
          `${IMAGE_API_CONFIG.pexels.baseUrl}${IMAGE_API_CONFIG.pexels.searchEndpoint}?` + 
          new URLSearchParams({
            query: query,
            per_page: IMAGE_API_CONFIG.pexels.defaultParams.per_page.toString(),
            orientation: IMAGE_API_CONFIG.pexels.defaultParams.orientation
          }),
          {
            headers: {
              'Authorization': IMAGE_API_CONFIG.pexels.apiKey
            }
          }
        )
        
        // Handle rate limiting
        if (response.status === 429) {
          console.warn('Rate limited by Pexels API, waiting...')
          await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_CONFIG.retryDelay))
          continue
        }
        
        if (!response.ok) {
          console.warn(`API request failed: ${response.status} - ${response.statusText}`)
          continue
        }
        
        const data = await response.json()
        
        if (data.photos && data.photos.length > 0) {
          // Filter and score images for quality
          const scoredImages = data.photos.map((photo: any) => ({
            ...photo,
            score: calculateImageScore(photo, query, plantName)
          })).sort((a: any, b: any) => b.score - a.score)
          
          const bestImage = scoredImages[0]
          if (bestImage.score > 0) {
            imageData = bestImage
            break
          }
        }
      } catch (queryError) {
        console.warn(`Failed to search for: "${query}"`, queryError)
        continue
      }
    }
    
    if (!imageData) {
      throw new Error('No suitable plant images found after trying multiple search terms')
    }
    
    // Download and upload the image
    return await downloadAndUploadImage(imageData, plantName, scientificName, client)
    
  } catch (error) {
    console.error('Error in fetchPlantImage:', error)
    throw error
  }
}

/**
 * Score images based on relevance and quality
 */
function calculateImageScore(photo: any, searchQuery: string, plantName: string): number {
  let score = 0
  const alt = photo.alt?.toLowerCase() || ''
  const photographer = photo.photographer?.toLowerCase() || ''
  
  // Positive scoring
  const qualityKeywords = IMAGE_API_CONFIG.searchTerms.qualityKeywords
  qualityKeywords.forEach(keyword => {
    if (alt.includes(keyword)) score += 2
  })
  
  // Boost score for plant name matches
  if (alt.includes(plantName.toLowerCase())) score += 5
  
  // Boost for green/natural terms
  if (alt.includes('green') || alt.includes('nature')) score += 3
  
  // Penalize images with excluded content
  const excludeKeywords = IMAGE_API_CONFIG.searchTerms.excludeKeywords
  excludeKeywords.forEach(keyword => {
    if (alt.includes(keyword)) score -= 5
  })
  
  // Quality factors
  if (photo.width >= IMAGE_API_CONFIG.imageFilter.minWidth) score += 1
  if (photo.height >= IMAGE_API_CONFIG.imageFilter.minHeight) score += 1
  
  return Math.max(0, score) // Ensure non-negative score
}

/**
 * Download image from URL and upload to Sanity
 */
async function downloadAndUploadImage(
  imageData: any, 
  plantName: string, 
  scientificName?: string, 
  client?: any
): Promise<any> {
  try {
    const imageUrl = imageData.src.large
    const imageResponse = await fetch(imageUrl)
    
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image: ${imageResponse.status}`)
    }
    
    const imageBlob = await imageResponse.blob()
    
    // Create filename
    const timestamp = Date.now()
    const safePlantName = plantName.toLowerCase().replace(/[^a-z0-9]/g, '-')
    const filename = `plant-${safePlantName}-${timestamp}.jpg`
    
    // Create File object
    const imageFile = new File([imageBlob], filename, {
      type: imageBlob.type || 'image/jpeg'
    })
    
    // Upload to Sanity with metadata
    const asset = await client.assets.upload('image', imageFile, {
      filename,
      source: {
        name: 'pexels-auto-fetch',
        url: imageData.url,
        id: imageData.id?.toString()
      },
      metadata: {
        fetched: true,
        photographer: imageData.photographer,
        source: 'Pexels',
        originalUrl: imageData.url,
        pexelsId: imageData.id,
        plantName,
        ...(scientificName && {scientificName}),
        fetchedAt: new Date().toISOString(),
        imageScore: calculateImageScore(imageData, '', plantName),
        altText: imageData.alt || `${plantName} plant image`
      }
    })
    
    return asset
    
  } catch (error) {
    console.error('Error downloading/uploading image:', error)
    throw error
  }
}