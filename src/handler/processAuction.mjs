import { closeAuction } from "../../lib/closeAuction.mjs"
import { getEndedAuction } from "../../lib/endedAuction.mjs"
// process.env.AWS_REGION = 'eu-north-1'
// process.env.AWS_DEFAULT_REGION = 'eu-north-1'
async function processAuction(event , context){
   try {
      console.log("process.env" , process.env)
      const auctionToClose = await getEndedAuction()
      console.log(auctionToClose)
      const auctionClosed = auctionToClose.map(auction => closeAuction(auction))
      await Promise.all(auctionClosed)
      return {closed : auctionClosed.length};            // we can do these because these function is not triggered by api gateway
   } catch (error) {
      console.error(`error happened in the process auction module -> ${error}`)
   }
}


export const handler = processAuction