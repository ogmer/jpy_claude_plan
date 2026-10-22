import { JsonLd } from '../components/JsonLd'
import { toMetadata } from '../lib/metadata'
import { HOME_META } from '../seo'
import { HomePage } from '../views/HomePage'

export const metadata = toMetadata(HOME_META)

export default function Page() {
  return (
    <>
      <JsonLd meta={HOME_META} />
      <HomePage />
    </>
  )
}
