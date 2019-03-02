---
title: "Gobrains"
date: 2019-03-03T00:48:59+09:00
description: "a simulation of simple creatures, controlled by physically-modeled neural-networks."
---

[Gobrains](https://github.com/rynorris/gobrains) is a simulation of simple creatures, controlled by physically-modeled neural-networks.

This project was a joint-effort in 2014 between myself and my then-colleague [Tom Lee](https://github.com/SilentGray).

It is a much more performant and better architected re-implementation of my original [PyBrains](https://github.com/rynorris/pybrains), which was a similar project written in Python.

Overview
--------

The creatures must find food in their environment in order to not slowly starve to death.

The initial batch of creatures is born with completely randomly generated brains, and then creatures are mated entirely at random.
They evolve intelligence purely through natural selection, _there is no explicit fitness function_.  If a creature lives longer, it gets more chances to mate, that is all.

{{<figure src="gobrains-web.png" caption="Figure 1. The tank" >}}

Technical Details
-----------------

### Creatures

The creatures are very simple.  They have just a few inputs and outputs to their brains.

Inputs:

- *Antennae* - Send charge into the brain when the antenna is hovering over food.
- *Mouth* - Sends charge into the brain when the creature is eating.
- *Linear Booster* - Propels the creature forward when the associated brain node is charged.
- *Angular Booster* - Rotates the creature depending on the charge of the associated brain node.
- *Pulse* - A constant pulse which provides charge to the brain on a timer so that the creatures can "think" without external stimuli.

{{<figure src="gobrains-creature.png" caption="Figure 2. A creature" >}}

### Brains

The brains used in gobrains are not the standard mathematical neural-network.  Instead, they are an attempt to simulate electrical activity in a brain, devised myself from first-principles.

Note:  I have no actual academic knowledge of how real brains work.  The implementation here is purely dreamt up as a way this _could_ work. (and turns out it does :D)

A brain is composed of several layers of *nodes*.  All the nodes in one layer are pairwise connected to all the nodes in the next layer by *synapses*.

Both nodes and synapses hold a certain amount of charge, which decays over time.

Synapses have an associated weight (determined by the creature's DNA).  Each time step, a synapse adds (or removes) charge from its output node based on a function of its weight, and the charge it currently holds.

Nodes build up charge from their input synapses, and once they reach a certain firing threshold, discharge into their output synapses.

### Breeding

On a set frequency, two creatures are chosen at random and bred to produce a single child.

Their DNA strands are merged together based on the real genetic processes of [recombination](https://en.wikipedia.org/wiki/Genetic_recombination) and random mutation to produce the child DNA.

The child is then immediately added to the environment.

Results
-------

The results were surprisingly good.

Generally there is a long period at the beginning of a run where the creatures can do nothing except spin aimlessly in circles.  This is expected due to how the evolution process is entirely unguided.

After a while however, one creature will mutate in such a way that they move forwards.  This is a massive advantage since they are able to occasionally wander on top of nearby food blobs.
This mutation quickly takes hold, and the entire population walks forward in straight lines, or round in circles.

Eventually, the creatures learn to use the input from their antennae to turn towards nearby food, and the input from their mouth to stop moving until the current food-blob is fully consumed.

{{<figure width="50%" src="gobrains-evolved.gif" caption="Figure 3. A creature navigates towards food and stops moving so it can feed" >}}

Note that natural selection is _slow_.  GoBrains is multi-threaded, and manages to max-out ~4 cores on my 2017 Macbook Pro, and yet it takes at least 10-15 minutes to achieve creatures who are reasonably adept at finding food.
