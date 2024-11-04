import { useWeb3React, Web3ReactProvider } from '@web3-react/core'
import { useEffect } from 'react'

import { PRIORITIZED_CONNECTORS } from '../connections'

const CONNECTED_WALLET_KEY = 'connectedWallet'

type LastConnectorName = 'INJECTED' | 'COINBASE_WALLET' | 'WALLET_CONNECT' | 'GNOSIS_SAFE' | 'NETWORK'

function RenderChildren({ children }: { children: JSX.Element | JSX.Element[] }) {
  const { connector } = useWeb3React()

  useEffect(() => {
    const run = async () => {
      let lastConnectorName = localStorage.getItem(CONNECTED_WALLET_KEY)
      console.log('Last Connector Name: ', lastConnectorName)
      if (lastConnectorName) {
        if (lastConnectorName === 'MetaMask') {
          lastConnectorName = 'INJECTED'
        } else if (lastConnectorName === 'CoinbaseWallet') {
          lastConnectorName = 'COINBASE_WALLET'
        }
        const connectorConfig = PRIORITIZED_CONNECTORS[lastConnectorName as LastConnectorName]
        console.log('Connector Config: A', connectorConfig)
        if (connectorConfig) {
          console.log('Connector Config: ', connectorConfig)
          await connector.activate()
        }
      }
    }
    run()
  }, [])

  // Save the connected wallet to localStorage
  useEffect(() => {
    console.log('Connector: ', connector.constructor.name)
    if (connector) {
      localStorage.setItem(CONNECTED_WALLET_KEY, connector.constructor.name)
      console.log('set item: ', localStorage.getItem(CONNECTED_WALLET_KEY))
    }
  }, [connector])
  return <>{children}</>
}

export const Web3ContextProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
  return (
    <Web3ReactProvider
      connectors={Object.values(PRIORITIZED_CONNECTORS).map((connector) => [connector.connector, connector.hooks])}
    >
      <RenderChildren>{children}</RenderChildren>
    </Web3ReactProvider>
  )
}
