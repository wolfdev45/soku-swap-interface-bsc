import { Contract } from '@ethersproject/contracts'
import { ChainId, WETH as WBNB } from '@pancakeswap-libs/sdk-v2'
import { ChainId as ethID, WETH as weth} from '@uniswap/sdk'
import { abi as IUniswapV2PairABI } from '@uniswap/v2-core/build/IUniswapV2Pair.json'
import { useMemo } from 'react'
import ENS_ABI from '../constants/abis/ens-registrar.json'
import ENS_PUBLIC_RESOLVER_ABI from '../constants/abis/ens-public-resolver.json'
import { ERC20_BYTES32_ABI } from '../constants/abis/erc20'
import ERC20_ABI from '../constants/abis/erc20.json'
import WETH_ABI from '../constants/abis/weth.json'
import { MULTICALL_ABI, MULTICALL_NETWORKS } from '../constants/multicall'
import { getContract } from '../utils'
import { useActiveWeb3React } from './index'
import {
  REGISTRY_CONTRACT_ADDRESS,
  REGISTRY_CONTRACT_ETH_ADDRESS,
  MIDROUTER_CONTRACT_ADDRESS,
  REGISTRY_CONTRACT_ABI,
  MIDROUTER_CONTRACT_ABI,
} from '../constants/autonomy'


const isBSC = window.location.href.includes('/bsc/')
const isETH = window.location.href.includes('/ethereum/')


// returns null on errors
function useContract(address: string | undefined, ABI: any, withSignerIfPossible = true): Contract | null {
  const { library, account } = useActiveWeb3React()

  return useMemo(() => {
    if (!address || !ABI || !library) return null
    try {
      return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [address, ABI, library, withSignerIfPossible, account])
}

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible)
}

export function useWETHContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  console.log(chainId)
 

let add
  if(isETH){
   add = '0xc778417E063141139Fce010982780140Aa0cD5Ab'   /* ropsten weth address!!!!!!! */
  } else {
    add = chainId ? WBNB[chainId].address : undefined
  }
  return useContract(add, WETH_ABI, withSignerIfPossible)

}

export function useENSRegistrarContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  let address: string | undefined
  if (chainId) {
    switch (chainId) {
      case ChainId.MAINNET:
      case ChainId.BSCTESTNET:
    }
  }
  return useContract(address, ENS_ABI, withSignerIfPossible)
}

export function useENSResolverContract(address: string | undefined, withSignerIfPossible?: boolean): Contract | null {
  return useContract(address, ENS_PUBLIC_RESOLVER_ABI, withSignerIfPossible)
}

export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible)
}

export function usePairContract(pairAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(pairAddress, IUniswapV2PairABI, withSignerIfPossible)
}

export function useMulticallContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && MULTICALL_NETWORKS[chainId], MULTICALL_ABI, false)
}



export function useRegistryContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React();
  let registry
  if (isBSC) {
    registry = REGISTRY_CONTRACT_ADDRESS[chainId || ChainId.MAINNET]
  } else if (isETH) {
    registry = REGISTRY_CONTRACT_ETH_ADDRESS[chainId || ChainId.MAINNET]
  }
  return useContract(registry, REGISTRY_CONTRACT_ABI, withSignerIfPossible)


}

export function useMidRouterContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(MIDROUTER_CONTRACT_ADDRESS[chainId || ChainId.MAINNET], MIDROUTER_CONTRACT_ABI, withSignerIfPossible)
}
