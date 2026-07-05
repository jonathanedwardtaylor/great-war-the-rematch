# Unit Roster

This roster is a design guide, not final balance. The goal is historically inspired units that produce clear tactical choices on a mobile screen.

The first playable should use a small cut of this roster. Later phases can add specialist units, heavier vehicles, naval maps, and off-map air support.

## Design Principles

- Every unit occupies one tile.
- Units should look like living soldiers, crews, vehicles, and boats, not board-game markers.
- Unit silhouettes must be readable at phone size.
- Terrain rules should matter as much as attack power.
- Historical inspiration is useful, but game clarity wins over strict simulation.
- In-game names should be original unless we later decide to use real historical model names.

## Prototype Priority

- P0: First playable candidate.
- P1: Early expansion candidate once movement, attacks, and terrain work.
- P2: Later campaign, specialist, or map-specific unit.

## Core Stat Language

- Move: tiles per turn on normal ground.
- Range: attack distance in tiles.
- Armor: rough durability against small arms and splash damage.
- Attack Type: direct, suppressive, splash, indirect, support, or utility.
- Terrain Access: terrain the unit can enter without special help.
- Special: the unit's main reason to exist.

## Terrain Tags

- Open: basic grass, dirt, or dry battlefield ground.
- Road: faster movement for most units.
- Mud: slows infantry and badly slows vehicles.
- Trench: defensive infantry position.
- Wire: blocks or slows infantry unless cleared.
- Forest: slows infantry and blocks many vehicle paths.
- Crater: rough cover, but poor vehicle terrain.
- Sandbags: defensive position.
- Bridge: crossing point for rivers or canals.
- Objective: capture or mission tile.
- River: shallow or navigable water.
- Deep Water: naval-only water.

## First Playable Recommendation

Start with six units:

| Unit | Why It Belongs First |
| --- | --- |
| Rifle Infantry | Captures objectives and teaches core movement. |
| Machine Gun Team | Introduces suppression and defensive positioning. |
| Grenadier | Introduces short-range splash damage. |
| Engineer | Introduces terrain interaction through wire, trenches, and repairs. |
| Field Gun | Introduces long-range fire and vulnerability. |
| Light Tank | Introduces armor, wire crushing, and vehicle movement limits. |

This gives the prototype enough variety without needing naval rules, aircraft rules, morale systems, or a huge animation set.

## Infantry And Support Units

| Unit | Historical Inspiration | Move | Range | Armor | Attack Type | Terrain Access | Special | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Rifle Infantry | Line infantry platoons and rifle sections | 3 | 1-2 | 0 | Direct | Open, Road, Mud, Trench, Forest, Crater, Sandbags, Objective | Captures objectives; flexible baseline unit. | P0 |
| Machine Gun Team | Maxim, Vickers, Hotchkiss, and similar crewed guns | 2 | 3 | 0 | Suppressive | Open, Road, Trench, Sandbags, Objective | Suppresses a lane or small arc; strong when set up, weak when flanked. | P0 |
| Grenadier | Hand grenades, rifle grenades, and trench raiding troops | 3 | 1-2 | 0 | Small Splash | Open, Road, Mud, Trench, Forest, Crater, Sandbags, Objective | Damages clustered infantry and trench defenders. | P0 |
| Engineer | Sappers, pioneers, trench builders, and repair crews | 3 | 1 | 0 | Utility | Open, Road, Mud, Trench, Forest, Crater, Sandbags, Objective | Builds wire, clears wire, digs trenches, repairs bridges, repairs tanks. | P0 |
| Flamethrower | Assault troops using early flamethrower weapons | 2 | 1 | 0 | Close Splash | Open, Road, Mud, Trench, Crater, Objective | Ignores trench cover and causes panic-style pressure; fragile and short-ranged. | P1 |
| Medic | Stretcher bearers and battlefield medical support | 3 | 1 | 0 | Support | Open, Road, Mud, Trench, Forest, Crater, Sandbags, Objective | Restores or stabilizes nearby infantry; weak or no attack. | P1 |
| Officer | Junior officer, NCO, or signal leader | 3 | 1-2 | 0 | Support | Open, Road, Mud, Trench, Forest, Crater, Sandbags, Objective | Improves nearby action economy, morale, or accuracy. | P1 |
| Scout | Patrol troops and forward observers | 4 | 1 | 0 | Direct | Open, Road, Mud, Trench, Forest, Crater, Objective | Reveals fog of war and spots targets for artillery. | P1 |

## Artillery And Heavy Weapons

| Unit | Historical Inspiration | Move | Range | Armor | Attack Type | Terrain Access | Special | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Field Gun | 75mm and similar field artillery pieces | 1 | 4-6 | 0 | Indirect Splash | Road, Open, Sandbags, Objective | Long-range splash; must be protected and may need setup. | P0 |
| Trench Mortar | Light and medium trench mortars | 2 | 3-4 | 0 | Indirect Splash | Open, Road, Trench, Crater, Sandbags, Objective | Arcing fire over cover; shorter range than field guns. | P1 |
| Heavy Artillery | Corps-level guns and howitzers | 0 | Off-map | 0 | Off-map Splash | Not a board unit | Scenario ability, barrage, or timed mission event. | P2 |
| Anti-Tank Gun | Late-war anti-armor guns and improvised defenses | 1 | 3-4 | 0 | Direct Anti-Armor | Road, Open, Sandbags, Objective | Strong against tanks, poor against spread infantry. | P2 |

## Vehicle Units

| Unit | Historical Inspiration | Move | Range | Armor | Attack Type | Terrain Access | Special | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Armored Car | Rolls-Royce, Austin, and similar armored cars | 5 on Road, 2 off-road | 2 | 1 | Direct | Road, Open, Objective | Fast scout and raider; weak in mud, forests, and trenches. | P1 |
| Light Tank | Renault FT-style light tank | 3 | 2 | 2 | Direct | Open, Road, Mud, Wire, Objective | Crushes wire, resists small arms, flexible turret-style attack. | P0 |
| Heavy Landship | British Mark IV and Mark V-style heavy tanks | 2 | 2-3 | 3 | Direct Heavy | Open, Road, Mud, Wire, Trench Edge, Objective | Breakthrough unit; crosses wire and some trench obstacles, but slow. | P1 |
| Fast Tank | Whippet-style fast tank | 4 | 2 | 2 | Direct | Open, Road, Mud, Wire, Objective | Mobile exploitation unit; weaker than heavy tanks. | P1 |
| Assault Tank | Schneider, Saint-Chamond, and A7V-style assault tanks | 2 | 3 | 3 | Direct Heavy | Open, Road, Mud, Objective | Heavy firepower, clumsy movement, vulnerable to flanking. | P2 |
| Supply Truck | Early motor transport | 4 on Road, 1 off-road | 0 | 0 | Support | Road, Objective | Resupplies artillery, repairs, or scenario resources. | P2 |

## Naval And Water Units

WW1 naval warfare was important, and artillery on ships absolutely existed. For this game, naval units should appear on river, canal, landing, or coastal maps rather than every mission.

| Unit | Historical Inspiration | Move | Range | Armor | Attack Type | Terrain Access | Special | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Transport Boat | River craft, landing boats, and small transports | 3 | 0-1 | 0 | Support | River, Deep Water, Dock | Carries infantry or engineers across water. | P2 |
| River Gunboat | Armed river and patrol craft | 3 | 3 | 1 | Direct Splash | River, Deep Water | Mobile fire support on water maps. | P2 |
| Monitor | Shallow-draft naval bombardment vessel | 2 | 5-7 | 2 | Heavy Indirect Splash | Deep Water, Coast, Wide River | Slow floating artillery for special missions. | P2 |
| Destroyer | Naval escort and coastal combat ship | Off-map | Off-map | 2 | Off-map Strike | Not a normal board unit | Scenario ability on coastal maps. | P2 |
| Submarine | U-boat and anti-shipping warfare inspiration | Off-map | Off-map | 1 | Scenario Pressure | Not a normal board unit | Campaign event, convoy threat, or naval objective. | P2 |

## Air Power

Aircraft existed in WW1 and became important for reconnaissance, artillery spotting, bombing, and air combat. They should not be controllable board units in the first playable.

Better first uses:

- Recon flight: reveals fog of war for one turn.
- Artillery spotting: improves field gun or off-map barrage accuracy.
- Bombing run: delayed strike with visible warning tiles.
- Balloon observation: static map feature that extends vision or artillery range.

Keep planes out of the first unit lineup so we do not need flight rules, anti-air rules, altitude, fuel, or complex animations before the ground tactics work.

## Suggested Movement Defaults

| Terrain | Infantry | Machine Gun | Engineer | Field Gun | Light Tank | Heavy Tank | Armored Car |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Open | Normal | Normal | Normal | Slow | Normal | Slow | Slow |
| Road | +1 Move | +1 Move | +1 Move | Normal | +1 Move | Normal | +2 Move |
| Mud | -1 Move | -1 Move | -1 Move | Blocked or Slow | Slow | Slow | Blocked |
| Trench | Normal | Normal | Normal | Blocked | Blocked or Slow Edge | Slow Edge | Blocked |
| Wire | Blocked | Blocked | Clearable | Blocked | Crush | Crush | Blocked |
| Forest | Normal | Slow | Normal | Blocked | Blocked | Blocked | Blocked |
| Crater | Slow | Slow | Slow | Blocked | Slow | Blocked or Slow | Blocked |
| Bridge | Normal | Normal | Normal | Normal | Normal | Normal | Normal |

## Tank Style Palette

Use a few distinct tank families rather than one generic tank:

| Game Role | Historical Shape Inspiration | Gameplay Feel |
| --- | --- | --- |
| Light Tank | Renault FT-style small turreted tank | Flexible, compact, good first tank. |
| Heavy Landship | British Mark IV and Mark V-style rhomboid tank | Slow, iconic, wire-crushing breakthrough unit. |
| Fast Tank | Whippet-style faster tank | Mobile flanker and objective pressure. |
| Assault Tank | Schneider, Saint-Chamond, and A7V-style boxy tanks | Heavy gun platform, clumsy but dangerous. |

## Animation Notes

Infantry and crew units should have small idle behaviors:

- Rifle infantry adjust helmets, shift rifles, glance down the trench line.
- Machine gun crews check ammo belts, brace the tripod, or tap the gun housing.
- Grenadiers weigh a grenade in hand or crouch before throwing.
- Engineers unroll wire, test a shovel, or inspect a repair kit.
- Flamethrower troops check the hose and tank, but should remain readable and not horror-themed.
- Field gun crews rotate the barrel, load shells, and duck after firing.
- Tanks rock slightly, exhaust puffs, treads twitch, and turrets or guns adjust.
- Boats bob gently, rotate guns, and emit small wake effects.

## Scope Guardrails

- Do not build the whole roster first.
- Do not add planes as controllable units until the ground game is already fun.
- Do not add naval units until we intentionally make a water map.
- Do not add morale, ammo, fuel, and suppression all at once.
- Use the roster to guide art and future design, not to block the first playable.

## Open Questions

- Should engineers build trenches during combat, before combat, or both?
- Should barbed wire fully block infantry or just consume extra movement?
- Should tanks crush wire automatically or spend an action?
- Should splash damage affect friendly units?
- Should machine gun suppression reduce movement, accuracy, or actions?
- Should field guns fire every turn, or require a setup/reload turn?
- Should naval units be playable, enemy-only, or scenario support?
