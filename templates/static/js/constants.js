// Role names
const AGENT_OF_CHAOS = 'Agent of Chaos';
const BOY_NEXTDOOR = 'Boy Nextdoor';
const DEVILS_ADVOCATE = 'Devil\'s Advocate';
const DOG_WHISPERER = 'Dog Whisperer';
const INEXPLICABLE = 'Inexplicable';
const INSOMNIAC = 'Insomniac';
const MASON = 'Mason';
const MINION = 'Minion';
const NUT_JOB = 'Nut Job';
const PODCASTER = 'Podcaster';
const RATIONALIST = 'Rationalist';
const ROBBER = 'Robber';
const SEER = 'Seer';
const STONER = 'Stoner';
const TANNER = 'Tanner';
const TROUBLEMAKER = 'Troublemaker';
const VILLAGER = 'Villager';
const WEREWOLF = 'Werewolf';

// ALL_ROLES represents an array of all the possible roles that exist.
const ALL_ROLES = [
    AGENT_OF_CHAOS,
    BOY_NEXTDOOR,
    DEVILS_ADVOCATE,
    DOG_WHISPERER,
    INEXPLICABLE,
    INSOMNIAC,
    MASON,
    MINION,
    NUT_JOB,
    PODCASTER,
    RATIONALIST,
    ROBBER,
    SEER,
    STONER,
    TANNER,
    TROUBLEMAKER,
    VILLAGER,
    WEREWOLF,
];

/*
 *  ROLE_METADATA represents a dictionary of each possible role that exists to its metadata fields.
 *  Available metadata:
 *    - description: abridged description of the role
 *    - imageFilePath: path to an image that depicts the role icon
 */
const ROLE_METADATA = {
    agentofchaos: {
        description: 'Switches cards with another player and takes their role. Agent of Chaos then joins opposite of new player\'s original team.',
        imageFilePath: 'agentofchaos.png',
    },
    boynextdoor: {
        description: 'Plays for themselves. Wins if player to the left or right dies.',
        imageFilePath: 'boynextdoor.png',
    },
    devilsadvocate: {
        description: 'Village team. Knows all of the werewolves, but loses if voted against by all of them.',
        imageFilePath: 'devilsadvocate.png',
    },
    dogwhisperer: {
        description: 'Village team. Knows one werewolf, but dies if that werewolf is killed. Is a werewolf if only one or no others.',
        imageFilePath: 'dogwhisperer.png',
    },
    inexplicable: {
        description: 'Village team. Flips a coin, and if heads, becomes any of most other roles and performs their action.',
        imageFilePath: 'inexplicable.png',
    },
    insomniac: {
        description: 'Village team. Observes own card at the end of the night, prior only to Inexplicable.',
        imageFilePath: 'insomniac.png',
    },
    mason: {
        description: 'Village team. Wakes up and looks for other masons.',
        imageFilePath: 'mason.png',
    },
    minion: {
        description: 'Werewolf team. Knows all werewolves. Wins if killed or if a village team role dies. If no werewolves, behaves as a werewolf instead.',
        imageFilePath: 'minion.png',
    },
    nutjob: {
        description: 'Village team. Can make random guess of all werewolves before voting, but must reveal card first. Correct guess wins automatically.',
        imageFilePath: 'nutjob.png',
    },
    podcaster: {
        description: 'Village team. Can privately inspect any other player\'s card during the day, but with strict majority approval only.',
        imageFilePath: 'podcaster.png',
    },
    rationalist: {
        description: 'Village team. Inspects a single other player\'s card after every possible role-switch, except the Inexplicable.',
        imageFilePath: 'rationalist.png',
    },
    robber: {
        description: 'Village team. Switches cards with another player and takes on new role.',
        imageFilePath: 'robber.png',
    },
    seer: {
        description: 'Village team. Inspects any other player\'s card or two cards from the center.',
        imageFilePath: 'seer.png',
    },
    stoner: {
        description: 'Village team. Shuffles two other player\'s cards, then inspects only one before placing back.',
        imageFilePath: 'stoner.png',
    },
    tanner: {
        description: 'Plays for themselves. Wins if killed.',
        imageFilePath: 'tanner.png',
    },
    troublemaker: {
        description: 'Village team. Switches cards between two other players, without looking.',
        imageFilePath: 'troublemaker.png',
    },
    villager: {
        description: 'Village team. No special abilities.',
        imageFilePath: 'villager.png',
    },
    werewolf: {
        description: 'Werewolf team. Looks for other werewolves, or at a center card if there are none.',
        imageFilePath: 'werewolf.png',
    }
};

export default {
    AGENT_OF_CHAOS,
    BOY_NEXTDOOR,
    DEVILS_ADVOCATE,
    DOG_WHISPERER,
    INEXPLICABLE,
    INSOMNIAC,
    MASON,
    MINION,
    NUT_JOB,
    PODCASTER,
    RATIONALIST,
    ROBBER,
    SEER,
    STONER,
    TANNER,
    TROUBLEMAKER,
    VILLAGER,
    WEREWOLF,

    ALL_ROLES,
    ROLE_METADATA,
};