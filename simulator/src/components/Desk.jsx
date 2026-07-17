import Button from "./Button";
import Fader from "./Fader";
import Knob from "./Knob";
import Switch from "./Switch";

function onChange(uid, value) {
    console.log(uid, value);
}

export default function Desk() {
    return (
        <div className="relative w-full h-full">
            {/* prettier-ignore */}
            <>
            <Button x={195} y={635} angle={45} style="square" size={50} uid="B1" onChange={onChange} />
            <Button x={255} y={574} angle={45} style="square" size={50} uid="B2" onChange={onChange} />
            <Button x={314} y={635} angle={45} style="square" size={50} uid="B3" onChange={onChange} />
            <Button x={255} y={695} angle={45} style="square" size={50} uid="B4" onChange={onChange} />
            <Button x={252} y={463} angle={0} style="round" size={60} uid="B5" onChange={onChange} />
            <Button x={211} y={410} angle={0} style="round" size={20} uid="B6" onChange={onChange} />
            <Button x={292} y={410} angle={0} style="round" size={20} uid="B7" onChange={onChange} />
            <Button x={330} y={310} angle={0} style="round" size={20} uid="B8" onChange={onChange} />
            <Button x={374} y={224} angle={0} style="round" size={20} uid="B9" onChange={onChange} />
            <Button x={583} y={125} angle={0} style="round" size={30} uid="B10" onChange={onChange} />
            <Button x={386} y={480} angle={0} style="square" size={20} uid="B11" onChange={onChange} />
            <Button x={433} y={436} angle={0} style="square" size={20} uid="B12" onChange={onChange} />
            <Button x={475} y={393} angle={0} style="square" size={20} uid="B13" onChange={onChange} />
            <Button x={520} y={351} angle={0} style="square" size={20} uid="B14" onChange={onChange} />
            <Button x={558} y={315} angle={0} style="square" size={20} uid="B15" onChange={onChange} />
            <Button x={466} y={574} angle={0} style="round" size={60} uid="B16" onChange={onChange} />
            <Button x={458} y={647} angle={0} style="round" size={20} uid="B17" onChange={onChange} />
            <Button x={536} y={630} angle={0} style="round" size={20} uid="B18" onChange={onChange} />
            <Button x={608} y={257} angle={0} style="square" size={34} uid="B19" onChange={onChange} />
            <Button x={686} y={258} angle={0} style="square" size={34} uid="B20" onChange={onChange} />
            <Button x={765} y={260} angle={0} style="square" size={34} uid="B21" onChange={onChange} />
            <Button x={844} y={259} angle={0} style="square" size={34} uid="B22" onChange={onChange} />
            <Button x={924} y={258} angle={0} style="square" size={34} uid="B23" onChange={onChange} />
            <Button x={748} y={348} angle={0} style="round" size={60} uid="B24" onChange={onChange} />
            <Button x={875} y={325} angle={0} style="square" size={20} uid="B25" onChange={onChange} />
            <Button x={931} y={325} angle={0} style="square" size={20} uid="B26" onChange={onChange} />
            <Button x={986} y={325} angle={0} style="square" size={20} uid="B27" onChange={onChange} />
            <Button x={859} y={493} angle={0} style="round" size={20} uid="B28" onChange={onChange} />
            <Button x={868} y={536} angle={0} style="round" size={20} uid="B29" onChange={onChange} />
            <Button x={898} y={573} angle={0} style="round" size={30} uid="B30" onChange={onChange} />
            <Button x={951} y={593} angle={0} style="round" size={20} uid="B31" onChange={onChange} />
            <Button x={1008} y={582} angle={0} style="round" size={20} uid="B32" onChange={onChange} />
            <Button x={1085} y={133} angle={0} style="round" size={60} uid="B33" onChange={onChange} />
            <Button x={1083-15} y={334-5} angle={45} style="square" size={50} uid="B34" onChange={onChange} />
            <Button x={1144-15} y={273-5} angle={45} style="square" size={50} uid="B35" onChange={onChange} />
            <Button x={1202-15} y={334-5} angle={45} style="square" size={50} uid="B36" onChange={onChange} />
            <Button x={1144-15} y={396-5} angle={45} style="square" size={50} uid="B37" onChange={onChange} />
            <Button x={1098} y={456} angle={0} style="round" size={20} uid="B38" onChange={onChange} />
            <Button x={1193} y={455} angle={0} style="round" size={20} uid="B39" onChange={onChange} />
            <Button x={1073} y={667} angle={0} style="round" size={20} uid="B40" onChange={onChange} />
            <Button x={1132} y={686} angle={0} style="round" size={20} uid="B41" onChange={onChange} />
            <Button x={1200} y={667} angle={0} style="square" size={34} uid="B42" onChange={onChange} />
            <Button x={1217} y={611} angle={0} style="square" size={34} uid="B43" onChange={onChange} />
            <Button x={1235} y={557} angle={0} style="square" size={34} uid="B44" onChange={onChange} />
            <Button x={1286} y={383} angle={0} style="round" size={60} uid="B45" onChange={onChange} />
            <Button x={1292} y={288} angle={0} style="round" size={30} uid="B46" onChange={onChange} />
            <Button x={1364} y={281} angle={0} style="round" size={20} uid="B47" onChange={onChange} />
            <Button x={1420} y={270} angle={0} style="round" size={20} uid="B48" onChange={onChange} />
            <Button x={1505} y={327} angle={0} style="round" size={20} uid="B49" onChange={onChange} />
            <Button x={1514} y={370} angle={0} style="round" size={20} uid="B50" onChange={onChange} />
            <Button x={1300} y={673} angle={0} style="round" size={60} uid="B51" onChange={onChange} />
            <Button x={1393} y={611} angle={0} style="round" size={60} uid="B52" onChange={onChange} />
            <Button x={1472} y={535} angle={0} style="round" size={60} uid="B53" onChange={onChange} />
            <Button x={1254} y={751} angle={0} style="square" size={20} uid="B54" onChange={onChange} />
            <Button x={1314} y={764} angle={0} style="square" size={20} uid="B55" onChange={onChange} />
            <Button x={1372} y={746} angle={0} style="square" size={20} uid="B56" onChange={onChange} />
            <Button x={1427} y={716} angle={0} style="square" size={20} uid="B57" onChange={onChange} />
            <Button x={1471} y={682} angle={0} style="square" size={20} uid="B58" onChange={onChange} />
            <Button x={1509} y={642} angle={0} style="square" size={20} uid="B59" onChange={onChange} />
            <Button x={1544} y={597} angle={0} style="square" size={20} uid="B60" onChange={onChange} />
            <Button x={1564} y={539} angle={0} style="square" size={20} uid="B61" onChange={onChange} />
            <Knob x={82} y={478} size={100} uid="P1" onChange={onChange} />
            <Knob x={186} y={442} size={20} uid="P2" onChange={onChange} />
            <Knob x={251} y={388} size={20} uid="P3" onChange={onChange} />
            <Knob x={316} y={443} size={20} uid="P4" onChange={onChange} />
            <Knob x={281} y={341} size={20} uid="P5" onChange={onChange} />
            <Knob x={364} y={270} size={20} uid="P6" onChange={onChange} />
            <Knob x={358} y={172} size={35} uid="P7" onChange={onChange} />
            <Knob x={450} y={123} size={100} uid="P8" onChange={onChange} />
            <Knob x={454} y={244} size={20} uid="P9" onChange={onChange} />
            <Knob x={510} y={242} size={20} uid="P10" onChange={onChange} />
            <Knob x={552} y={215} size={20} uid="P11" onChange={onChange} />
            <Knob x={579} y={179} size={20} uid="P12" onChange={onChange} />
            <Knob x={426} y={620} size={20} uid="P13" onChange={onChange} />
            <Knob x={499} y={660} size={20} uid="P14" onChange={onChange} />
            <Knob x={556} y={592} size={20} uid="P15" onChange={onChange} />
            <Knob x={572} y={530} size={35} uid="P16" onChange={onChange} />
            <Knob x={573+10} y={474+5} size={20} uid="P17" onChange={onChange} />
            <Knob x={591+10} y={427+5} size={20} uid="P18" onChange={onChange} />
            <Knob x={620+10} y={387+5} size={20} uid="P19" onChange={onChange} />
            <Knob x={668+10} y={367+5} size={20} uid="P20" onChange={onChange} />
            <Knob x={686} y={470} size={100} uid="P21" onChange={onChange} />
            <Knob x={1043} y={653} size={20} uid="P22" onChange={onChange} />
            <Knob x={1102} y={674} size={20} uid="P23" onChange={onChange} />
            <Knob x={1060} y={433} size={20} uid="P24" onChange={onChange} />
            <Knob x={1146} y={470} size={20} uid="P25" onChange={onChange} />
            <Knob x={1228} y={422} size={20} uid="P26" onChange={onChange} />
            <Knob x={1214} y={132} size={20} uid="P27" onChange={onChange} />
            <Knob x={1199} y={183} size={20} uid="P28" onChange={onChange} />
            <Knob x={1209} y={227} size={20} uid="P29" onChange={onChange} />
            <Knob x={1239} y={267} size={20} uid="P30" onChange={onChange} />
            <Knob x={1262} y={153} size={100} uid="P31" onChange={onChange} />
            <Knob x={1474} y={280} size={35} uid="P32" onChange={onChange} />
            <Switch x={368} y={428} angle={90} uid="S1" onChange={onChange} />
            <Switch x={420} y={379} angle={90} uid="S2" onChange={onChange} />
            <Switch x={467} y={332} angle={90} uid="S3" onChange={onChange} />
            <Switch x={511} y={292} angle={90} uid="S4" onChange={onChange} />
            <Switch x={442-10} y={495-15} angle={90} uid="S5" onChange={onChange} />
            <Switch x={494-10} y={445-15} angle={90} uid="S6" onChange={onChange} />
            <Switch x={541-10} y={399-15} angle={90} uid="S7" onChange={onChange} />
            <Switch x={580-10} y={361-15} angle={90} uid="S8" onChange={onChange} />
            <Switch x={866} y={420} uid="S9" onChange={onChange} />
            <Switch x={908} y={420} uid="S10" onChange={onChange} />
            <Switch x={952} y={420} uid="S11" onChange={onChange} />
            <Switch x={996} y={419} uid="S12" onChange={onChange} />
            <Switch x={1244} y={484} uid="S13" onChange={onChange} />
            <Switch x={1509} y={426} angle={90} uid="S14" onChange={onChange} />
            <Switch x={1563} y={426} angle={90} uid="S15" onChange={onChange} />
            <Switch x={1509} y={468} angle={90} uid="S16" onChange={onChange} />
            <Switch x={1563} y={468} angle={90} uid="S17" onChange={onChange} />
            <Fader x={150} y={430} angle={-90} style="lever" uid="L1" onChange={onChange} />
            <Fader x={230} y={360} angle={-90} style="lever" uid="L2" onChange={onChange} />
            <Fader x={300} y={290} angle={-90} style="lever" uid="L3" onChange={onChange} />
            <Fader x={150+1150} y={430+200} angle={-90} style="lever" uid="L4" onChange={onChange} />
            <Fader x={230+1150} y={360+200} angle={-90} style="lever" uid="L5" onChange={onChange} />
            <Fader x={300+1150} y={290+200} angle={-90} style="lever" uid="L6" onChange={onChange} />
            <Fader x={170} y={620} angle={-45} uid="F1" onChange={onChange} />
            <Fader x={380} y={630} angle={225} uid="F2" onChange={onChange} />
            <Fader x={350} y={360} angle={-45} uid="F3" onChange={onChange} />
            <Fader x={686} y={590} uid="F4" onChange={onChange} />
            <Fader x={805} y={570} angle={-90} uid="F5" onChange={onChange} />
            <Fader x={890} y={360} uid="F6" onChange={onChange} />
            <Fader x={660} y={230} angle={-90} uid="F7" onChange={onChange} />
            <Fader x={660+(75*1)} y={230} angle={-90} uid="F8" onChange={onChange} />
            <Fader x={660+(75*2)} y={230} angle={-90} uid="F9" onChange={onChange} />
            <Fader x={660+(75*3)} y={230} angle={-90} uid="F10" onChange={onChange} />
            <Fader x={660+(75*4)} y={230} angle={-90} uid="F11" onChange={onChange} />

            <Fader x={1080} y={620} angle={20} uid="F12" onChange={onChange} />
            <Fader x={1080+(10*1)} y={620+(-34*1)} angle={20} uid="F13" onChange={onChange} />
            <Fader x={1080+(10*2)} y={620+(-34*2)} angle={20} uid="F14" onChange={onChange} />
            <Fader x={1080+(10*3)} y={620+(-34*3)} angle={20} uid="F15" onChange={onChange} />
            </>
        </div>
    );
}
