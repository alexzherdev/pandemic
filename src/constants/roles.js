export default Object.freeze({
  cont_planner: {
    id: 'cont_planner',
    name: 'Contingency Planner',
    description: [`The Contingency Planner may, as an action, take an Event card from anywhere
      in the Player Discard Pile and place it on his Role card. Only 1 Event card can be on his
      role card at a time. It does not count against his hand limit.`, `When the Contingency Planner
      plays the Event card on his role card, remove this Event card from the game (instead of discarding it).`]
  },

  dispatcher: {
    id: 'dispatcher',
    name: 'Dispatcher',
    description: [`The Dispatcher may, as an action, either:`,
      `• move any pawn, if its owner agrees, to any city containing another pawn, or`,
      `• move another player’s pawn, if its owner agrees, as if it were his own.`,
      `The Dispatcher can only move other players’ pawns; he may not direct them to do other actions,
      such as Treat Disease.`]
  },

  medic: {
    id: 'medic',
    name: 'Medic',
    description: [`The Medic removes all cubes, not 1, of the same color when doing the Treat Disease action.`,
      `If a disease has been cured, he automatically removes all cubes of that color from a city,
      simply by entering it or being there. This does not take an action.`,
      `The Medic also prevents placing disease cubes (and outbreaks) of cured diseases in his location.`]
  },

  ops_expert: {
    id: 'ops_expert',
    name: 'Operations Expert',
    description: [`The Operations Expert may, as an action, either:`,
      `• build a research station in his current city without discarding (or using) a City card, or`,
      `• once per turn, move from a research station to any city by discarding any City card.`]
  },

  quar_spec: {
    id: 'quar_spec',
    name: 'Quarantine Specialist',
    description: [`The Quarantine Specialist prevents both outbreaks and the placement of disease cubes
      in the city she is in and all cities connected to that city. She does not affect cubes placed during setup.`]
  },

  researcher: {
    id: 'researcher',
    name: 'Researcher',
    description: [`As an action, the Researcher may give any City card from her hand to another player
      in the same city as her, without this card having to match her city. The transfer must be from
      her hand to the other player’s hand, but it can occur on either player’s turn.`]
  },

  scientist: {
    id: 'scientist',
    name: 'Scientist',
    description: [`The Scientist needs only 4 (not 5) City cards of the same disease color
      to Discover a Cure for that disease.`]
  }
});
