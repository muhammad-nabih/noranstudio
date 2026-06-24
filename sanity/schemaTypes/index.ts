import { aboutSchema } from './About.schema'
import { caseStudySchema } from './CaseStudy.schema'
import { footerSchema } from './Footer.schema'
import project from './project'
import service from './service'
import siteSettingsSchema from './SocialSettings.schema'


export const schemaTypes = [
  project,
  service,
  caseStudySchema,
  footerSchema,
  aboutSchema,
  siteSettingsSchema,  
]