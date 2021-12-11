# pay.party

![](https://i.imgur.com/FthDZz5.png)


## Summary

**pay.party** is a tool used to distribute compensation to team members based on democratic principles. 

Using Pay.Party, A user can create and fund a pay.party election, assigning candidate and voter roles to any number of Ethereum addresses. Address participants can vote on their peers to determine the compensation distribution from the elections funding pool. 

When a pay.party has ended, the funds are distributed to each candidate based on the election outcome, and users are notified of their dispersement.. 

### How it works

Upon creating a pay.party election, a creator adds participants by assigning any number of addresses a voter and/or candidate role, the election funding token and amount, the number of votes every voter gets, and other related metadata (name, description, etc.). If an address has a _voter_ role, the address participates by voting on candidates. If, however, an address has a _candidate_ role, the address participates by voting _and_ being voted on in which case they may receive a portion of the election pool's funding. 


## Product Roadmap

pay.party has gone through _many_ iterations, and that probably won't stop for some time. Below, I propose a few key features I'd like to see us put resources toward.

- [ ] Rebrand to pay.party 
    - This is mostly aesthetic; however, myself and a few members of the team think it would be best to preserve the old quadratic-diplomacy repo and start a new repo under moonshotcollective/pay.party. This would avoid any Github and CI/CD headaches. 
- [ ] Typescript 
    - If you’re unfamiliar with TypeScript, it’s a language that builds on JavaScript by adding syntax for type declarations and annotations. Utilizing the scaffold-eth-typescript template is a great way to test and expand the scaffold-eth ecosystem and could help mitigate many issues we've faced in the past.  
- [ ] Voting Stratagies
    - With the rebranding effort, pay.party is no longer tied to the "quadratic lands"! This allows us to implement any number of vote distribution strategies. For example, in some cases, linear voting might make more sense than quadratic voting. In the future, it may even be reasonable to allow users to create their own distribution curves. 
- [ ] Contract 2.0
    - The v1 contract currently deployed on mainnet, matic, and testnets are complicated... too complicated. It was made this way for old requirements and a flexible product fit. This is no longer the case, and maintaining the current version is more of a liability than it is worth. The new contracts should be simple, allow escrow pool funding and non-escrow funding. 
- [ ] Deploy contracts on L2s
    - Polygon, Arbitrum, xDai, as well as Mainnet
- [ ] Improved Backend Integration
    - Currently, the deployment relies on the Ceramic network for the "database" and voting mechanics. While this approach is "decentralized", it does not come without additional headaches friction, like having a 3ID on ceramic or connecting/signing extra services, as well as the API support. I propose we move to an alternative, like IPFS with Infura pinging, and possibly look beyond the "decentralized" narrative. 
- [ ] Connect  to CPK 
    - Connect the navigation to the rest of [the CPK](https://gist.github.com/owocki/6c970c1532d8ba05368f31ac336ad934) and deploy to L2s that the other CPKs use.
- [ ] User Testing
     - Test with Moonshot Collective + MMM + at least one other workstream or DAO.  Incremental tickets may fall out of this.
- [ ] Contributor graphics
     - add in contributor graphs like https://twitter.com/bradwmorris/status/1465905469818490883?s=21

## External Links

