"use client";

import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { format } from "date-fns";
import { useEffect, useState } from "react";

import { getAllList } from "@/lib/record/actions";
import type { recordSchemaType } from "@/lib/record/verification";
import {
  intToTime,
  pdfCategory,
  pdfPoolsize,
  pdfSex,
  recordDistance,
  recordStyle,
} from "@/lib/utils";

const FONTSIZE = 9;
const MARGIN_RIGHT = 2;
const TextJustify = (maxCharNum: number, fontSize: number, char: string) => {
  const normalizedChar = char.normalize("NFC");
  const charLength = [...normalizedChar].length;
  const a2z = normalizedChar.match(/[a-z]/g);
  const a2zLength = a2z !== null ? a2z.length : 0;
  const A2Z = normalizedChar.match(/[A-Z]/g);
  const A2ZLength = A2Z !== null ? A2Z.length : 0;
  const numbers = normalizedChar.match(/[0-9]/g);
  const numbersLength = numbers !== null ? numbers.length : 0;
  const nbsp = normalizedChar.match(/ /g);
  const nbspLength = nbsp !== null ? nbsp.length : 0;

  const charNum =
    a2zLength * 0.5277 +
    A2ZLength * 0.7307 +
    numbersLength * 0.6129 +
    nbspLength * 0.2857 +
    (charLength - (a2zLength + A2ZLength + numbersLength + nbspLength));

  const space = Math.max(
    ((maxCharNum - charNum) * fontSize) / (charLength - 1),
    0,
  );

  return (
    <Text
      style={[
        {
          width: maxCharNum * (fontSize + 3),
          fontSize: fontSize,
          letterSpacing: space,
          textAlign: "left",
          // paddingHorizontal: 0,
          // marginLeft: fontSize,
          marginRight: fontSize * (MARGIN_RIGHT + 1) + maxCharNum * -3,
          marginBottom: fontSize / 3,
        },
      ]}
    >
      {normalizedChar}
    </Text>
  );
};

const RecordPDF = () => {
  const [record, setRecord] = useState<recordSchemaType[]>([]);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const styleLength = Math.max(
    ...recordStyle.map((d) => d.label.length).values(),
  );
  const distanceLength = Math.max(
    ...recordDistance.map((d) => d.label.length).values(),
  );
  const timeLength = Math.max(
    ...record.map((d) => intToTime(d.time).length).values(),
  );
  const swimmerLength = Math.max(
    ...record
      .map((d) => {
        if (d.swimmer1 && d.swimmer2 && d.swimmer3 && d.swimmer4) {
          const length = Math.max(
            `${d.swimmer1.trim()}・${d.swimmer2.trim()}`.length,
            `${d.swimmer3.trim()}・${d.swimmer4.trim()}`.length,
          );
          return length;
        } else {
          return d.swimmer1.length;
        }
      })
      .values(),
  );
  const teamLength = Math.max(...record.map((d) => d.team.length).values());
  const placeLength = Math.max(...record.map((d) => d.place.length).values());
  const meetNameLength = Math.max(
    ...record.map((d) => d.meetName.length).values(),
  );

  // Create styles
  const styles = StyleSheet.create({
    page: {
      backgroundColor: "#FFFFFF",
      fontFamily: "IPASans",
      fontSize: FONTSIZE,
    },
    titleContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    lastUpdated: {
      textAlign: "right",
      fontSize: FONTSIZE,
      fontFamily: "IPASerif",
      width: "100%",
      paddingRight: 10,
      marginBottom: FONTSIZE,
    },
    categoryTitle: {
      flexWrap: "wrap",
      textAlign: "center",
      fontSize: 18,
      fontFamily: "IPASans",
      width: "100%",
      marginBottom: FONTSIZE,
    },
    sexTitle: {
      flexWrap: "wrap",
      textAlign: "center",
      fontSize: 16,
      fontFamily: "IPASans",
      marginBottom: FONTSIZE * 2,
      width: "100%",
    },
    tableContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      paddingHorizontal: 20,
    },
    row: {
      flexDirection: "row",
      alignItems: "flex-start",
      fontFamily: "IPASerif",
      fontSize: FONTSIZE,
      marginVertical: (FONTSIZE * 2) / 3,
    },
    distance: {
      textAlign: "right",
      width: 5 * FONTSIZE,
      fontSize: FONTSIZE,
      marginLeft: FONTSIZE * MARGIN_RIGHT * -1,
      marginRight: FONTSIZE * MARGIN_RIGHT,
    },
    time: {
      textAlign: "right",
      width: 4 * FONTSIZE,
      fontSize: FONTSIZE,
      marginRight: FONTSIZE * MARGIN_RIGHT,
    },
    // swimmer: { width: swimmerLength * FONTSIZE },
    // team: { width: teamLength * FONTSIZE },
    date: {
      fontSize: FONTSIZE,
      width: FONTSIZE * 5,
      marginLeft: FONTSIZE,
      marginRight: FONTSIZE * MARGIN_RIGHT,
    },
    // place: { width: placeLength * FONTSIZE },
    // meetName: { width: meetNameLength * FONTSIZE },
  });

  Font.registerHyphenationCallback((word) => [word.normalize("NFC")]);
  Font.register({
    family: "IPASans",
    src: "/fonts/ipaexg.ttf",
  });
  Font.register({
    family: "IPASerif",
    src: "/fonts/ipaexm.ttf",
  });

  const getRecord = async () => {
    try {
      const recordList = await getAllList();

      if (recordList === null) {
        throw new Error(`getAllList failed`);
      }

      if (recordList !== null) {
        const lastUpdateDate = recordList.reduce(
          (a: recordSchemaType, b: recordSchemaType) =>
            a.date > b.date ? a : b,
        );
        setRecord(recordList);
        setLastUpdated(lastUpdateDate.date);
        setIsReady(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setIsReady(false);
    getRecord();
  }, []);

  return isReady ? (
    <Document
      title="高知県記録一覧"
      pageMode="fullScreen"
      pageLayout="oneColumn"
    >
      {pdfPoolsize.map((p, pi) => {
        return pdfCategory.map((c, ci) => {
          return pdfSex.map((s, si) => {
            const lastUpdadteDate = record
              .filter((d) => d.poolsize === p.id)
              .filter((d) => d.category === c.id)
              .filter((d) => d.sex === s.id)
              .reduce((a: recordSchemaType, b: recordSchemaType) =>
                a.date > b.date ? a : b,
              ).date;
            return (
              <Page
                size="A4"
                orientation="portrait"
                style={styles.page}
                key={`poolsize_${pi}_category_${ci}_sex_${si}`}
              >
                <View style={styles.titleContainer}>
                  <View style={styles.categoryTitle}>
                    <View style={styles.lastUpdated}>
                      <Text>
                        {lastUpdadteDate &&
                          `${format(lastUpdadteDate, "yyyy年MM月dd日")}現在`}
                      </Text>
                    </View>
                    <Text>
                      {c.label}（{p.label}）
                    </Text>
                  </View>
                  <View style={styles.sexTitle}>
                    <Text>{s.label}</Text>
                  </View>
                </View>
                <View style={styles.tableContainer}>
                  {record
                    .filter((d) => d.poolsize === p.id)
                    .filter((d) => d.category === c.id)
                    .filter((d) => d.sex === s.id)
                    .map((d, di) => {
                      const currentStyle = d.style;
                      const currentStyleIndex = record.findIndex(
                        (x) => x.id === d.id,
                      );
                      const previousStyle =
                        currentStyleIndex &&
                        record.length > currentStyleIndex + 1
                          ? record[currentStyleIndex - 1].style
                          : 99;

                      const now = new Date();
                      const year =
                        now.getMonth() <= 3 && now.getDate() <= 31
                          ? now.getFullYear() - 1
                          : now.getFullYear();
                      const nextYear = year + 1;

                      const newRecord =
                        new Date(d.date) >= new Date(`${year}/4/1`) &&
                        new Date(`${nextYear}/3/31`);

                      return (
                        <View key={`record_${d.id}`} style={styles.row}>
                          {di === 0 || currentStyle !== previousStyle ? (
                            TextJustify(
                              styleLength,
                              FONTSIZE,
                              `${recordStyle.find((v) => v.id === d.style)?.label}`,
                            )
                          ) : (
                            <Text
                              style={[
                                {
                                  width: styleLength * (FONTSIZE + 3),
                                  fontSize: FONTSIZE,
                                  marginRight:
                                    styleLength * -3 +
                                    FONTSIZE * (MARGIN_RIGHT + 1),
                                },
                              ]}
                            ></Text>
                          )}
                          <Text style={styles.distance}>
                            {
                              recordDistance.find((v) => v.id === d.distance)
                                ?.label
                            }
                          </Text>
                          <View
                            style={[
                              {
                                color: newRecord ? "red" : "black",
                                // flexWrap: "nowrap",
                                flexDirection: "row",
                                // fontFamily: "IPASerif",
                              },
                            ]}
                          >
                            <Text
                              style={[
                                styles.time,
                                { color: newRecord ? "red" : "black" },
                              ]}
                            >
                              {intToTime(d.time)}
                            </Text>
                            {d.style >= 6 ? (
                              <View style={[{ justifyContent: "flex-start" }]}>
                                {TextJustify(
                                  swimmerLength,
                                  FONTSIZE,
                                  `${d.swimmer1}・${d.swimmer2}`,
                                )}
                                <br />
                                {TextJustify(
                                  swimmerLength,
                                  FONTSIZE,
                                  `${d.swimmer3}・${d.swimmer4}`,
                                )}
                              </View>
                            ) : (
                              TextJustify(swimmerLength, FONTSIZE, d.swimmer1)
                            )}

                            <View
                              style={[
                                {
                                  flexWrap: "nowrap",
                                  flexDirection: "row",
                                },
                              ]}
                            >
                              <Text
                                style={[
                                  {
                                    marginLeft: FONTSIZE * MARGIN_RIGHT * -1,
                                    marginRight: FONTSIZE,
                                  },
                                ]}
                              >
                                （
                              </Text>
                              {TextJustify(teamLength, FONTSIZE, d.team)}
                              <Text
                                style={[
                                  {
                                    marginLeft: FONTSIZE * MARGIN_RIGHT * -1,
                                  },
                                ]}
                              >
                                ）
                              </Text>
                            </View>

                            {/* {TextJustify(
                            teamLength + 2,
                            FONTSIZE,
                            `（${d.team})`,
                          )} */}
                            <Text style={styles.date}>
                              {d.date && format(d.date, "yyyy/MM/dd")}
                            </Text>
                            <View>
                              {TextJustify(
                                placeLength + 2,
                                FONTSIZE - 2,
                                d.meetName,
                              )}
                              {TextJustify(
                                placeLength + 2,
                                FONTSIZE - 2,
                                `（${d.place}）`,
                              )}

                              {/* <View
                              style={[
                                {
                                  flexWrap: "nowrap",
                                  flexDirection: "row",
                                },
                              ]}
                            >
                              <Text
                                style={[
                                  {
                                    marginRight: FONTSIZE - 2,
                                  },
                                ]}
                              >
                                （
                              </Text>
                              {TextJustify(placeLength, FONTSIZE - 2, d.place)}
                              <Text
                                style={[
                                  {
                                    marginLeft: FONTSIZE - 2,
                                  },
                                ]}
                              >
                                ）
                              </Text>
                            </View> */}
                            </View>
                          </View>
                        </View>
                      );
                    })}
                </View>
              </Page>
            );
          });
        });
      })}
    </Document>
  ) : (
    <Document
      title="高知県記録一覧"
      pageMode="fullScreen"
      pageLayout="oneColumn"
    >
      <Page size="A4" orientation="landscape" style={styles.page}>
        <Text>データが取得できませんでした。</Text>
      </Page>
    </Document>
  );
};

export default RecordPDF;
