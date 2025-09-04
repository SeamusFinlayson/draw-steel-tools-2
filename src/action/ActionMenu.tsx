import DiceRoller from "./diceRoller/DiceRoller";

function ActionMenu() {
  return (
    <div className="flex h-screen flex-col gap-4 py-2">
      <DiceRoller />
    </div>
  );
}

export default ActionMenu;
