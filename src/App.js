import React from "react"
import { Query } from "react-apollo"
import gql from "graphql-tag"
import keyBy from "lodash/keyBy"

import { LEAGUES } from "./constants"
import { useInput } from "./utils"
import Headhunter from "./headhunter"
import Mirror from "./mirror"
import Spinner from "./spinner"
import Tabs from "./tabs"
import headhunterImg from "./Headhunter.png"
import mirrorImg from "./Mirror.png"

const CARDS_QUERY = gql`
    query Cards {
        ninjaItems(ids: [636, 1476, 1496, 1529]) {
            id
            name
            stackSize
            artFilename
            chaosValue
        }
    }
`

const OptionHeader = ({ leagueInput, yourTotalInput, liquidationRatioInput }) => (
    <section className="section">
        <nav className="level">
            <div className="level-item has-text-centered" style={{ flexDirection: "column" }}>
                <p className="heading is-size-6">League</p>
                <div className="select">
                    <select id="league" name="league" {...leagueInput}>
                        {LEAGUES.map(league => (
                            <option key={league} value={league}>
                                {league}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="level-item has-text-centered">
                <div>
                    <p className="heading is-size-6">Total</p>
                    <p className="title">
                        <input className="input" type="text" {...yourTotalInput} />
                    </p>
                </div>
            </div>
            <div className="level-item has-text-centered">
                <div>
                    <p className="heading is-size-6">Liquidation Ratio</p>
                    <p className="title">
                        <input
                            className="input"
                            type="number"
                            {...liquidationRatioInput}
                            min={0}
                            max={1}
                            step={0.1}
                        />
                    </p>
                </div>
            </div>
        </nav>
    </section>
)

const Home = () => {
    const leagueInput = useInput("league", LEAGUES[0])
    const yourTotalInput = useInput("yourTotal", 0)
    const liquidationRatioInput = useInput("liquidationRatio", 0.6)

    const userTotal = yourTotalInput.value * liquidationRatioInput.value

    return (
        <div>
            <OptionHeader
                leagueInput={leagueInput}
                yourTotalInput={yourTotalInput}
                liquidationRatioInput={liquidationRatioInput}
            />

            <Query query={CARDS_QUERY}>
                {({ loading, error, data: { ninjaItems: cards } }) => {
                    if (loading) {
                        return (
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Spinner />
                            </div>
                        )
                    }
                    if (error) {
                        console.error(error)
                        return null
                    }

                    cards = keyBy(cards, "name")

                    return (
                        <Tabs
                            titles={[
                                <img
                                    src={headhunterImg}
                                    alt="Headhunter"
                                    style={{ height: "1.5rem" }}
                                />,
                                <img src={mirrorImg} alt="Mirror" style={{ height: "1.5rem" }} />,
                            ]}
                        >
                            <Headhunter cards={cards} userTotal={userTotal} />
                            <Mirror cards={cards} userTotal={userTotal} />
                        </Tabs>
                    )
                }}
            </Query>
        </div>
    )
}

export default Home
