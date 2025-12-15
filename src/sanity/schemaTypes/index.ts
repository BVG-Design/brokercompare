import { blogType } from './blogType'
import { authorType } from './author'
import { categoryType } from './category'
// import { productType } from './product' // Deprecated
import { serviceProviderType } from './serviceProvider'
import { softwareListingType } from './softwareListing'
import { worksWithType } from './worksWith'

export const schemaTypes = [
  blogType,
  authorType,
  categoryType,
  // productType,
  serviceProviderType,
  softwareListingType,
  worksWithType,
]
