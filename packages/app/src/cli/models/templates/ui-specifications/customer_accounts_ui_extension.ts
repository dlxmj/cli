import {TemplateSpecification} from '../../app/template.js'
import {uiFlavors} from '../common.js'

/**
 * Customer Accounts UI extension template specification.
 */
const customerAccountsUIExtension: TemplateSpecification = {
  identifier: 'customer_accounts_ui_extension',
  name: 'Customer Accounts',
  group: 'Shopify private',
  supportLinks: [],
  types: [
    {
      url: 'https://github.com/Shopify/cli',
      type: 'customer_accounts_ui_extension',
      extensionPoints: [],
      supportedFlavors: uiFlavors('packages/app/templates/ui-extensions/projects/customer_accounts_ui_extension'),
    },
  ],
}

export default customerAccountsUIExtension
