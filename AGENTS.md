# Architecture rules
- External draw animations compare incoming number contents before React batching, queue each new draw, and ignore duplicate synchronization deliveries; this prevents lost or restarted animations.
- Animate the existing 3D ball with compositor transforms and an explicit hold interval separate from travel; keep animation timing in the tested drawAnimation module.