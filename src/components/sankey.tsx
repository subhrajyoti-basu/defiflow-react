import { useQuery, gql } from "@apollo/client"
import React, { useEffect, useState } from "react"
import nodeName from "./graph"


const SWAP_QUERY = gql`
{
  swaps(limit: 50){
    transactionHash
    blockNumber
  tokenAddressFrom
    symbolFrom{
      decimals
      symbol
      price{
        price
      }
    }
  tokenAddressTo
    symbolTo{
      symbol
      price{
        price
      }
    }
    valueFrom
    valueTo
    timestamp
  }
}

`



function Sanky() {
  const { data, loading, error } = useQuery(SWAP_QUERY)
  const ref = React.useRef(null);
  const [state, setState] = useState<{ swaps: object[] }>()



  useEffect(() => {
    setState(data)
    if (state) {
      var a = state.swaps.filter((d: any) => {
        if (d.tokenAddressFrom !== d.tokenAddressTo && d.symbolTo !== null && d.symbolFrom !== null && d.symbolFrom.price !== null) {
          // console.log(d.symbolFrom.symbol, d.symbolTo.symbol, (parseFloat(d.valueFrom) / 10 ** d.symbolFrom.decimals) * parseFloat(d.symbolFrom.price.price))
          return { from: d.symbolFrom.symbol, to: d.symbolTo.symbol, volume: (parseFloat(d.valueFrom) / 10 ** d.symbolFrom.decimals) * parseFloat(d.symbolFrom.price.price) }
        }
      })
      var b = a.map((d: any) => {
        return { from: d.symbolFrom.symbol, to: d.symbolTo.symbol, volume: +((parseFloat(d.valueFrom) / 10 ** d.symbolFrom.decimals) * parseFloat(d.symbolFrom.price.price)) }
      })
      nodeName(b, ref.current)
    } else setState(data)
  })

  if (loading) return (<>{'loading...'}</>);
  if (error) return (<>{error.message}</>);



  return (
    <div className="max-w-[979px] mx-auto">
      <div className="text-white flex">
        <div className="ml-[25%]">Sell Swap</div>
        <div className="ml-auto mr-[25%]">Buy Swap</div>

      </div>

      <div ref={ref}>
        {/* <ul>
        {data.swaps.map((d: any) => {
          if (d.tokenAddressFrom !== d.tokenAddressTo && d.symbolTo !== null && d.symbolFrom !== null && d.symbolFrom.price !== null) {
            return <li key={d.transactionHash}>{d.symbolFrom.symbol} {'->'} {d.symbolTo.symbol} {' volume '} {(parseFloat(d.valueFrom) / 10 ** d.symbolFrom.decimals) * parseFloat(d.symbolFrom.price.price)}</li>
          }
        })}
      </ul> */}
      </div>
      <div className="text-white pb-10 text-center">Flow of Token Swaps on Ethereum</div>
    </div>
  )
}

export default Sanky;

