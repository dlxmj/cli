import {selectApp} from '../select-app.js'
import {AppInterface} from '../../../models/app/app.js'
import {OutputMessage, outputContent, outputToken} from '@shopify/cli-kit/node/output'

type Format = 'json' | 'text'

export async function showEnv(app: AppInterface): Promise<OutputMessage> {
  return outputEnv(app, 'text')
}

export async function outputEnv(app: AppInterface, format: Format): Promise<OutputMessage> {
  const selectedApp = await selectApp()

  let isNextJs: boolean = false
  for (const web of app.webs) {
    isNextJs = web.framework?.toLowerCase() === 'nextjs'
    if (isNextJs) break
  }

  if (format === 'json') {
    return outputContent`${outputToken.json({
      ...(isNextJs ? {NEXT_PUBLIC_SHOPIFY_API_KEY: selectedApp.apiKey} : {}),
      SHOPIFY_API_KEY: selectedApp.apiKey,
      SHOPIFY_API_SECRET: selectedApp.apiSecretKeys[0]?.secret,
      SCOPES: app.configuration.scopes,
    })}`
  } else {
    if (isNextJs) {
      return outputContent`
    ${outputToken.green('NEXT_PUBLIC_SHOPIFY_API_KEY')}=${selectedApp.apiKey}
    ${outputToken.green('SHOPIFY_API_KEY')}=${selectedApp.apiKey}
    ${outputToken.green('SHOPIFY_API_SECRET')}=${selectedApp.apiSecretKeys[0]?.secret ?? ''}
    ${outputToken.green('SCOPES')}=${app.configuration.scopes}
  `
    }
    return outputContent`
    ${outputToken.green('SHOPIFY_API_KEY')}=${selectedApp.apiKey}
    ${outputToken.green('SHOPIFY_API_SECRET')}=${selectedApp.apiSecretKeys[0]?.secret ?? ''}
    ${outputToken.green('SCOPES')}=${app.configuration.scopes}
  `
  }
}
