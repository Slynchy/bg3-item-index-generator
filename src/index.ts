import * as fs from "fs";

type TItemType = "Weapon" | "Object" | "Armor" | "";
type TRarity = "Rare" | "Story" | "Legendary" | "VeryRare" | "Uncommon" | "None";
type TTypeValue = {
    type: string;
    version?: number;
    handle?: string;
    value?: string;
}

interface ILSJTemplate {
    save: {
        header: {},
        regions: {
            Templates: {
                GameObjects: Array<{
                    MapKey?: TTypeValue;
                    Name?: TTypeValue;
                    LevelName?: TTypeValue;
                    Icon?: TTypeValue;
                    Type?: TTypeValue;
                    ParentTemplateId?: TTypeValue;
                    VisualTemplate?: TTypeValue;
                    DisplayName?: TTypeValue;
                    Stats?: TTypeValue;
                    Description?: TTypeValue;
                }>
            },
        },
    }
}

type TTXTEntry = {
    key: string;
    type: TItemType;
    inheritsFrom?: string;
    rootTemplateKey?: string;
    otherData: Record<string, string>;
};
type TParsedTXTFile = Array<TTXTEntry>;

type TResult = Record<string, {
    name: string;
    description: string;
    inheritsFrom?: string;
    rarity: TRarity;
    type: TItemType;
    otherData: Record<string, string>;
}>;

type TTextFiles =
    "Weapon" |
    // "TreasureTable" |
    "Armor" |
    "Passive" |
    "Status_BOOST" |
    "Spell_Zone" |
    "Spell_Shout" |
    "Spell_Rush" |
    "Spell_Target" |
    "Spell_Projectile" |
    "Spell_Teleportation" |
    "Spell_Wall" |
    "Status_EFFECT";
    // "Equipment";

const textFilePaths: Record<TTextFiles, Array<string>> = {
    Spell_Target: [
        "Gustav/Public/Gustav/Stats/Generated/Data/Spell_Target.txt",
        "Gustav/Public/GustavDev/Stats/Generated/Data/Spell_Target.txt",
        "Shared/Public/Shared/Stats/Generated/Data/Spell_Target.txt",
        "Shared/Public/SharedDev/Stats/Generated/Data/Spell_Target.txt",
    ],
    Spell_Projectile: [
        "Gustav/Public/Gustav/Stats/Generated/Data/Spell_Projectile.txt",
        "Gustav/Public/GustavDev/Stats/Generated/Data/Spell_Projectile.txt",
        "Shared/Public/Shared/Stats/Generated/Data/Spell_Projectile.txt",
        "Shared/Public/SharedDev/Stats/Generated/Data/Spell_Projectile.txt",
    ],
    Spell_Rush: [
        "Gustav/Public/Gustav/Stats/Generated/Data/Spell_Rush.txt",
        "Gustav/Public/GustavDev/Stats/Generated/Data/Spell_Rush.txt",
        "Shared/Public/Shared/Stats/Generated/Data/Spell_Rush.txt",
        "Shared/Public/SharedDev/Stats/Generated/Data/Spell_Rush.txt",
    ],
    Spell_Shout: [
        "Gustav/Public/Gustav/Stats/Generated/Data/Spell_Shout.txt",
        "Gustav/Public/GustavDev/Stats/Generated/Data/Spell_Shout.txt",
        "Shared/Public/Shared/Stats/Generated/Data/Spell_Shout.txt",
        "Shared/Public/SharedDev/Stats/Generated/Data/Spell_Shout.txt",
    ],
    Spell_Teleportation: [
        "Gustav/Public/Gustav/Stats/Generated/Data/Spell_Teleportation.txt",
        "Gustav/Public/GustavDev/Stats/Generated/Data/Spell_Teleportation.txt",
        "Shared/Public/Shared/Stats/Generated/Data/Spell_Teleportation.txt",
        "Shared/Public/SharedDev/Stats/Generated/Data/Spell_Teleportation.txt",
    ],
    Spell_Wall: [
        // "Gustav/Public/Gustav/Stats/Generated/Data/Spell_Wall.txt",
        "Gustav/Public/GustavDev/Stats/Generated/Data/Spell_Wall.txt",
        // "Shared/Public/Shared/Stats/Generated/Data/Spell_Wall.txt",
        "Shared/Public/SharedDev/Stats/Generated/Data/Spell_Wall.txt",
    ],
    Spell_Zone: [
        "Gustav/Public/Gustav/Stats/Generated/Data/Spell_Zone.txt",
        "Gustav/Public/GustavDev/Stats/Generated/Data/Spell_Zone.txt",
        "Shared/Public/Shared/Stats/Generated/Data/Spell_Zone.txt",
        "Shared/Public/SharedDev/Stats/Generated/Data/Spell_Zone.txt",
    ],
    Armor: [
        "Gustav/Public/Gustav/Stats/Generated/Data/Armor.txt",
        "Gustav/Public/GustavDev/Stats/Generated/Data/Armor.txt",
        "Shared/Public/Shared/Stats/Generated/Data/Armor.txt",
        "Shared/Public/SharedDev/Stats/Generated/Data/Armor.txt",
    ],
    Passive: [
        "Gustav/Public/Gustav/Stats/Generated/Data/Passive.txt",
        "Gustav/Public/GustavDev/Stats/Generated/Data/Passive.txt",
        "Shared/Public/Shared/Stats/Generated/Data/Passive.txt",
        "Shared/Public/SharedDev/Stats/Generated/Data/Passive.txt",
    ],
    Status_BOOST: [
        "Gustav/Public/Gustav/Stats/Generated/Data/Status_BOOST.txt",
        "Gustav/Public/GustavDev/Stats/Generated/Data/Status_BOOST.txt",
        "Shared/Public/Shared/Stats/Generated/Data/Status_BOOST.txt",
        "Shared/Public/SharedDev/Stats/Generated/Data/Status_BOOST.txt",
    ],
    Status_EFFECT: [
        "Gustav/Public/Gustav/Stats/Generated/Data/Status_EFFECT.txt",
        "Gustav/Public/GustavDev/Stats/Generated/Data/Status_EFFECT.txt",
        "Shared/Public/Shared/Stats/Generated/Data/Status_EFFECT.txt",
        "Shared/Public/SharedDev/Stats/Generated/Data/Status_EFFECT.txt",
    ],
    Weapon: [
        "Gustav/Public/Gustav/Stats/Generated/Data/Weapon.txt",
        "Gustav/Public/GustavDev/Stats/Generated/Data/Weapon.txt",
        "Shared/Public/Shared/Stats/Generated/Data/Weapon.txt",
        "Shared/Public/SharedDev/Stats/Generated/Data/Weapon.txt",
    ]
    // Equipment: [
    //     "Gustav/Public/Gustav/Stats/Generated/Equipment.txt",
    //     "Gustav/Public/GustavDev/Stats/Generated/Equipment.txt",
    //     "Shared/Public/Shared/Stats/Generated/Equipment.txt",
    //     "Shared/Public/SharedDev/Stats/Generated/Equipment.txt",
    // ],
    // TreasureTable: [
    //     "Gustav/Public/Gustav/Stats/Generated/TreasureTable.txt",
    //     "Gustav/Public/GustavDev/Stats/Generated/TreasureTable.txt",
    //     "Shared/Public/Shared/Stats/Generated/TreasureTable.txt",
    //     "Shared/Public/SharedDev/Stats/Generated/TreasureTable.txt",
    // ],
};

const rootPath = "./data_patch_6";

const rootTemplatesPaths = [
    "Gustav/Public/Gustav/RootTemplates",
    "Gustav/Public/GustavDev/RootTemplates",
    "Shared/Public/Shared/RootTemplates",
    "Shared/Public/SharedDev/RootTemplates",
];

const localizationFilePath = `${rootPath}/Localization/english.json`;

const LSJCache: Record<string, ILSJTemplate> = {};

function warn(...params: string[]) {
    console.warn(...params);
}

function findShortestString(strings: string[]): string | null {
    if (strings.length === 0) {
        return null;
    }

    return strings.reduce((shortest, current) => {
        return current.length < shortest.length ? current : shortest;
    }, strings[0]);
}

async function main(): Promise<void> {
    // load localization JSON file
    const localizationJSON: Array<{
        "_": string;
        "$": {
            "contentuid": string
            "version": string
        };
    }> = JSON.parse(
        fs.readFileSync(
            localizationFilePath,
            "utf8"
        )
    ).contentList.content;

    // load all text files
    const textFiles: Record<TTextFiles, Array<string>> = {
        Spell_Projectile: [],
        Spell_Target: [],
        Spell_Rush: [],
        Spell_Shout: [],
        Spell_Teleportation: [],
        Spell_Wall: [],
        Spell_Zone: [],
        Armor: [],
        Passive: [],
        // Equipment: [],
        Status_BOOST: [],
        Status_EFFECT: [],
        // TreasureTable: [],
        Weapon: []
    };
    Object.keys(textFilePaths)
        .forEach((txtFileName: string) => {
            const resArr: Array<string> =
                textFiles[txtFileName as TTextFiles] =
                    [];
            textFilePaths[txtFileName as TTextFiles]
                .forEach((folderPath: string) => {
                    const fileBuffer =
                        fs.readFileSync(
                            `${rootPath}/${folderPath}`,
                            "utf8"
                        );
                    resArr.push(fileBuffer);
                });
        });

    // parse text files into TParsedTXTFile
    const parsedTextFiles: Record<TTextFiles, Array<TParsedTXTFile>> = {
        Spell_Target: [],
        Spell_Projectile: [],
        Spell_Rush: [],
        Spell_Shout: [],
        Spell_Teleportation: [],
        Spell_Wall: [],
        Spell_Zone: [],
        Armor: [],
        Passive: [],
        // Equipment: [],
        Status_BOOST: [],
        Status_EFFECT: [],
        // TreasureTable: [],
        Weapon: []
    };
    Object.keys(textFiles)
        .forEach((e) => {
            parsedTextFiles[e as TTextFiles] =
                textFiles[e as TTextFiles].map((e) => {
                    return parseTextFile(e);
                });
        })

    // iterate over them and localize them
    const result: TResult = {};
    for (let parsedTextFilesKey in parsedTextFiles) {
        const thing = parsedTextFiles[parsedTextFilesKey as TTextFiles];
        thing
            .forEach((txtFile) => {
                txtFile.forEach((entry) => {
                    result[entry.key] = {
                        name: "",
                        description: "",
                        inheritsFrom: entry.inheritsFrom,
                        rarity: (entry.otherData["Rarity"] as TRarity) || "None",
                        type: entry.type,
                        otherData: entry.otherData
                    };
                    if(
                        entry.otherData["DisplayName"]
                    ) {
                        const disName =
                            entry.otherData["DisplayName"].substring(
                                0,
                                entry.otherData["DisplayName"].indexOf(";")
                            );
                        // localization keys: (...matches)
                        result[entry.key].name = localizationJSON
                            .find(
                                (i) => i["$"].contentuid === disName
                            )?.["_"] || "";
                    }
                    if(
                        entry.otherData["Description"]
                    ) {
                        const desc =
                            entry.otherData["Description"].substring(
                                0,
                                entry.otherData["Description"].indexOf(";")
                            );
                        // localization keys: (...matches)
                        result[entry.key].description = localizationJSON
                            .find(
                                (i) => i["$"].contentuid === desc
                            )?.["_"] || "";
                    }

                    if(
                        entry.rootTemplateKey
                    ) {
                        let pathInd = -1;
                        for (let i = 0; i < rootTemplatesPaths.length; i++) {
                            if(
                                fs.existsSync(
                                    `data_lsj/${rootTemplatesPaths[i]}/${entry.rootTemplateKey}.lsj`
                                )
                            ) {
                                pathInd = i;
                                break;
                            }
                        }
                        if(pathInd !== -1) {
                            const key = `data_lsj/${rootTemplatesPaths[pathInd]}/${entry.rootTemplateKey}.lsj`;
                            let json: ILSJTemplate = LSJCache[
                                key
                            ];
                            if(!json) {
                                const buffer =
                                    fs.readFileSync(
                                        key,
                                        "utf8"
                                    );
                                json = JSON.parse(buffer);
                                LSJCache[key] = json;
                            }
                            const goRef = json.save.regions.Templates?.GameObjects[0];
                            if(!goRef) {
                                console.log(entry.rootTemplateKey);
                                return;
                            }

                            if(!entry.otherData["DisplayName"]) {
                                // localization keys: (...matches)
                                result[entry.key].name = localizationJSON
                                    .find(
                                        (i) => i["$"].contentuid ===  goRef.DisplayName?.handle
                                    )?.["_"] || "";
                            }

                            if(!entry.otherData["Description"]) {
                                // localization keys: (...matches)
                                result[entry.key].description = localizationJSON
                                    .find(
                                        (i) => i["$"].contentuid ===  goRef.Description?.handle
                                    )?.["_"] || "";
                            }
                            if(
                                goRef.Icon &&
                                !result[entry.key].otherData["Icon"]
                            ) {
                                result[entry.key].otherData["Icon"] =
                                    goRef.Icon.value || "{ERROR}";
                            } else if(entry.otherData["Icon"]) {
                                result[entry.key].otherData["Icon"] =
                                    entry.otherData["Icon"] || "{ERROR}";
                            }
                        }
                    }
                });
            });

        // console.log(result);
    }
    fs.writeFileSync(
        "./output.json",
        JSON.stringify(result, undefined, "  "),
        "utf8"
    );

    // console.log(
    //     parseTextFile(textFiles.Weapon[1])[1]
    // );
}

function removeQuoteMarks(str: string): string {
    return (
        str.substring(1, str.length - 1)
    ) as TItemType;
}

function parseTextFile(_buffer: string): TParsedTXTFile {
    const res: TParsedTXTFile = [];
    const split = _buffer
        .split("\r\n\r\n")
        .map((e) => e.trim());

    split
        .forEach((block) => {
            const blockRes: TTXTEntry = {
                key: "",
                otherData: {},
                rootTemplateKey: "",
                // inheritsFrom: "",
                type: ""
            };

            blockRes.key = block.substring(
                block.indexOf("new entry \"") + "new entry \"".length,
                block.indexOf("\n") - 2
            ).trim();

            blockRes.rootTemplateKey = block.substr(
                block.indexOf(`data "RootTemplate" "`) + `data "RootTemplate" "`.length,
                36
            ).trim();
            if(blockRes.rootTemplateKey[8] !== "-") {
                // warn(`Key "${blockRes.key}" is invalid`);
                delete blockRes.rootTemplateKey;
            }

            const split = block.split("\n").map((e) => e.trim());
            split.forEach((e) => {
                let splitBySpace = e.match(/(\w+) "([^"]+)"( "([^"]+)")?/);
                if(!splitBySpace || !splitBySpace[1]) return;
                splitBySpace.shift();
                switch(splitBySpace[0]) {
                    case "data":
                        blockRes.otherData[
                            splitBySpace[1]
                        ] = splitBySpace[2];
                        if(blockRes.otherData[splitBySpace[1]]) {
                            blockRes.otherData[splitBySpace[1]]
                                = removeQuoteMarks(blockRes.otherData[splitBySpace[1]].trim());
                        }
                        break;
                    case "type":
                        blockRes.type = (splitBySpace[1] as TItemType);
                        break;
                    case "using":
                        blockRes.inheritsFrom = (splitBySpace[1]);
                        break;
                    default:
                        break;
                }
            });

            res.push(blockRes);
        });

    return res;
}

main()
    .then(() => {
        console.log("Closing...");
    });