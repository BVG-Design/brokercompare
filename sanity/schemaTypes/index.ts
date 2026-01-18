import { blogType } from './blogType'
import { authorType } from './author'
import { categoryType } from './category'
import { embed } from './objects/embed'
import { searchIntentType } from './searchIntent'
import { directoryListingType } from './directoryListing'
import { featureType } from './feature'
import { featureCategoryType } from './featureCategory'
import { listingFeatureType } from './listingFeature'
import { badgeType } from './badge'
import { organisationType } from './organisation'
import { journeyStageType } from './journeyStage'
import { videoEmbedType } from './objects/videoEmbed'
import { listingType } from './listingType'
import { guideType } from './guideType'
import { subCategoryType } from './subCategory'

export const schemaTypes = [
  blogType,
  authorType,
  categoryType,
  subCategoryType,
  searchIntentType,
  directoryListingType,
  featureType,
  featureCategoryType,
  listingFeatureType,
  badgeType,
  organisationType,
  journeyStageType,
  guideType,
  videoEmbedType,
  listingType
]
