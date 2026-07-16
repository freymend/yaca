# Project Cronus

Messing around with real-time collaboration and WebRTC. This is a playground for me to learn about these technologies and see what I can build with them.

| Feature                   | Status      |
| ------------------------- | ----------- |
| Chat functionality        | In Progress |
| deeper Chat functionality | In Progress |
| WebRTC integration        | Planned     |

## TODO

- [x] P2P communication
  - [x] research WebRTC
    - [x] https://peerjs.com/
  - [x] STUN / TURN servers?
  - [ ] BiTorrent peer discovery?
    - [ ] https://github.com/dmotz/trystero

## Deployment

This project is deployed on Cloudflare Pages. You can access the live version [here](https://yaca.freymond.dev/)

Deployments are automatically triggered on every push to the main branch. You can also deploy manually by running the following command:

```bash
npm run deploy
```
