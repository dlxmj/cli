import {gql} from 'graphql-request'

export const UpdateURLsQuery = gql`
  mutation appUpdate($apiKey: String!, $applicationUrl: Url!, $redirectUrlWhitelist: [Url]!,$appProxyInput: AppProxyInput!) {
    appUpdate(input: {apiKey: $apiKey, applicationUrl: $applicationUrl, redirectUrlWhitelist: $redirectUrlWhitelist, appProxy: $appProxyInput}) {
      userErrors {
        message
        field
      }
    }
  }
`

export interface UpdateURLsQueryVariables {
  apiKey: string
  applicationUrl: string
  redirectUrlWhitelist: string[]
  appProxyInput?: {proxySubPathPrefix: string; proxySubPath: string; proxyUrl: string}
}

export interface UpdateURLsQuerySchema {
  appUpdate: {
    userErrors: {
      field: string[]
      message: string
    }[]
  }
}
