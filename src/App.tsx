import StickerId from "./StickerId";
import Detail from "./Detail";
import Recoil from "./Recoil";
import ReactQuery from "./ReactQuery";
import Theme from "./Theme";

export default function App() {
  return (
    <>
      <Recoil>
        <ReactQuery>
          <Theme>
            <StickerId />
            <Detail />
          </Theme>
        </ReactQuery>
      </Recoil>
    </>
  );
}
