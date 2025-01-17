import { drawerState } from "@atoms/navAtoms";
import { useRecoilValue } from "recoil";
import { ActionDrawerContent } from "./types/ActionDrawer";
import { AddItemDrawerContent } from "./types/AddItemDrawer";
import { AncestryDrawerContent } from "./types/AncestryDrawer";
import { BackgroundDrawerContent } from "./types/BackgroundDrawer";
import { ClassDrawerContent } from "./types/ClassDrawer";
import { ClassFeatureDrawerContent } from "./types/ClassFeatureDrawer";
import { FeatDrawerContent } from "./types/FeatDrawer";
import { GenericDrawerContent } from "./types/GenericDrawer";
import { InvItemDrawerContent } from "./types/InvItemDrawer";
import { ItemDrawerContent } from "./types/ItemDrawer";
import { LanguageDrawerContent } from "./types/LanguageDrawer";
import { SpellDrawerContent } from "./types/SpellDrawer";
import { StatAttrDrawerContent } from "./types/StatAttrDrawer";
import { StatHealthDrawerContent } from "./types/StatHealthDrawer";
import { StatProfDrawerContent } from "./types/StatProfDrawer";
import { TraitDrawerContent } from "./types/TraitDrawer";

export default function DrawerContent(props: {
  onMetadataChange?: (openedDict?: Record<string, string>) => void;
}) {
  const _drawer = useRecoilValue(drawerState);
  return (
    <>
      {_drawer?.type === "generic" && (
        <GenericDrawerContent data={_drawer.data} />
      )}
      {_drawer?.type === "feat" && <FeatDrawerContent data={_drawer.data} />}
      {_drawer?.type === "action" && (
        <ActionDrawerContent data={_drawer.data} />
      )}
      {_drawer?.type === "spell" && <SpellDrawerContent data={_drawer.data} />}
      {_drawer?.type === "item" && <ItemDrawerContent data={_drawer.data} />}
      {_drawer?.type === "class" && (
        <ClassDrawerContent
          data={_drawer.data}
          onMetadataChange={props.onMetadataChange}
        />
      )}
      {_drawer?.type === "class-feature" && (
        <ClassFeatureDrawerContent data={_drawer.data} />
      )}
      {_drawer?.type === "ancestry" && (
        <AncestryDrawerContent
          data={_drawer.data}
          onMetadataChange={props.onMetadataChange}
        />
      )}
      {_drawer?.type === "background" && (
        <BackgroundDrawerContent
          data={_drawer.data}
          onMetadataChange={props.onMetadataChange}
        />
      )}
      {_drawer?.type === "language" && (
        <LanguageDrawerContent data={_drawer.data} />
      )}
      {_drawer?.type === "heritage" && (
        <ActionDrawerContent data={_drawer.data} />
      )}
      {/* TODO */}
      {_drawer?.type === "sense" && <ActionDrawerContent data={_drawer.data} />}
      {/* TODO */}
      {_drawer?.type === "physical-feature" && (
        <ActionDrawerContent data={_drawer.data} />
      )}
      {/* TODO */}
      {_drawer?.type === "stat-prof" && (
        <StatProfDrawerContent data={_drawer.data} />
      )}
      {_drawer?.type === "stat-attr" && (
        <StatAttrDrawerContent data={_drawer.data} />
      )}
      {_drawer?.type === "stat-hp" && (
        <StatHealthDrawerContent data={_drawer.data} />
      )}
      {_drawer?.type === "trait" && <TraitDrawerContent data={_drawer.data} />}
      {_drawer?.type === "add-item" && (
        <AddItemDrawerContent data={_drawer.data} />
      )}
      {_drawer?.type === "inv-item" && (
        <InvItemDrawerContent data={_drawer.data} />
      )}
    </>
  );
}
