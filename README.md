# axiom-node

Axiom Node.js library written in TypeScript

## Usage

```typescript
import { AxiomLogger } from 'axiom'

const logger = new AxiomLogger({ 
  apiKey: 'xxx-xxx-xxx',
  dataset: 'my-dataset-prod'
})

logger.write({ message: 'Hello, world' })

logger.write({ message: 'Welcome to axiom', user: { name: 'Andrew' }})

...

// Force drain the logger and await until all logs are sent
await logger.drain()
```
