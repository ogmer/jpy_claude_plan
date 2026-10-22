import { JsonLd } from '../../components/JsonLd'
import { toMetadata } from '../../lib/metadata'
import { ABOUT_META } from '../../seo'
import { AboutPage } from '../../views/AboutPage'

export const metadata = toMetadata(ABOUT_META)

export default function Page() {
  return (
    <>
      <JsonLd meta={ABOUT_META} />
      <AboutPage />
    </>
  )
}
