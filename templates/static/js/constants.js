const WEREWOLF = 'Werewolf';
const VILLAGER = 'Villager';
const MINION = 'Minion';
const ROBBER = 'Robber';
const TROUBLEMAKER = 'Troublemaker';
const SEER = 'Seer';
const INSOMNIAC = 'Insomniac';
const TANNER = 'Tanner';
const MASON = 'Mason';
const DOG_WHISPERER = 'Dog Whisperer';
const DEVILS_ADVOCATE = 'Devil\'s Advocate';
const STONER = 'Stoner';
const RATIONALIST = 'Rationalist';
const AGENT_OF_CHAOS = 'Agent of Chaos';
const INEXPLICABLE = 'Inexplicable';
const BOY_NEXTDOOR = 'Boy Nextdoor';
const NUT_JOB = 'Nut Job';
const PODCASTER = 'Podcaster';

const ALL_ROLES = [
    WEREWOLF, VILLAGER, MINION, ROBBER, TROUBLEMAKER, SEER, INSOMNIAC, TANNER, MASON,
    DOG_WHISPERER, DEVILS_ADVOCATE, /*STONER, RATIONALIST, */AGENT_OF_CHAOS, INEXPLICABLE,
    BOY_NEXTDOOR, /*NUT_JOB, */PODCASTER
];

const ROLE_METADATA = {
    werewolf: {
        imageFilePath: 'werewolf.png',
        description: 'Werewolf team. Looks for other werewolves, or at a center card if there are none.'
    },
    villager: {
        imageFilePath: 'villager.png',
        description: 'Village team. No special abilities.'
    },
    minion: {
        imageFilePath: 'minion.png',
        description: 'Werewolf team. Knows all werewolves. Wins if killed or if a village team role dies. If no werewolves, behaves as a werewolf instead.'
    },
    robber: {
        imageFilePath: 'robber.png',
        description: 'Village team. Switches cards with another player and takes on new role.'
    },
    seer: {
        imageFilePath: 'seer.png',
        description: 'Village team. Inspects any other player\'s card or two cards from the center.'
    },
    troublemaker: {
        imageFilePath: 'troublemaker.png',
        description: 'Village team. Switches cards between two other players, without looking.'
    },
    insomniac: {
        imageFilePath: 'insomniac.png',
        description: 'Village team. Observes own card at the end of the night, prior only to Inexplicable.'
    },
    tanner: {
        imageFilePath: 'tanner.png',
        description: 'Neither team. Wins if killed.'
    },
    mason: {
        imageFilePath: 'mason.png',
        description: 'Village team. Wakes up and looks for other masons.'
    },
    dogwhisperer: {
        imageFilePath: 'dogwhisperer.png',
        description: 'Village team. Knows one werewolf, but dies if that werewolf is killed. Is a werewolf if only one or no others.'
    },
    devilsadvocate: {
        imageFilePath: 'devilsadvocate.png',
        description: 'Village team. Knows all of the werewolves, but loses if voted against by all of them.'
    },
    stoner: {
        imageFilePath: 'stoner.png',
        description: 'Village team. Shuffles two other player\'s cards, then inspects only one before placing back.'
    },
    rationalist: {
        imageFilePath: 'rationalist.png',
        description: 'Village team. Inspects a single other player\'s card after every possible role-switch, except the Inexplicable.'
    },
    agentofchaos: {
        imageFilePath: 'agentofchaos.png',
        description: 'Switches cards with another player and takes their role. Agent of Chaos then joins opposite of new player\'s original team.'
    },
    inexplicable: {
        imageFilePath: 'inexplicable.png',
        description: 'Village team. Flips a coin, and if heads, becomes any of most other roles and performs their action.'
    },
    boynextdoor: {
        imageFilePath: 'boynextdoor.png',
        description: 'Plays for themselves. Wins if player to the left or right dies.'
    },
    nutjob: {
        imageFilePath: 'nutjob.png',
        description: 'Village team. Can make random guess of all werewolves before voting, but must reveal card first. Correct guess wins automatically.'
    },
    podcaster: {
        imageFilePath: 'podcaster.png',
        description: 'Village team. Can privately inspect any other player\'s card during the day, but with strict majority approval only.'
    }
};

export default {
    ALL_ROLES,
    ROLE_METADATA,
    WEREWOLF,
    VILLAGER,
    MINION,
    ROBBER,
    SEER,
    TROUBLEMAKER,
    INSOMNIAC,
    TANNER,
    MASON,
    DOG_WHISPERER,
    DEVILS_ADVOCATE,
    STONER,
    RATIONALIST,
    AGENT_OF_CHAOS,
    INEXPLICABLE,
    BOY_NEXTDOOR,
    NUT_JOB,
    PODCASTER
};