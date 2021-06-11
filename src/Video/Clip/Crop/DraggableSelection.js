import Draggable from 'react-draggable';

function DraggableSelection () {
  const parentWidth = 300

  const handleStop = (e) => {
    const target = e.target
    const style = target.getAttribute('style')
    const offset = parseFloat(style.split('transform: translate(', 2)[1].split('px', 2)[0])
    console.log(100 * offset / parentWidth)
  }

  return (
    <div style={{width: parentWidth, height: 300, position: 'relative', backgroundColor: 'blue'}}><Draggable
      axis="x"
      defaultPosition={{x: 0, y: 0}}
      bounds="parent"
      position={null}
      scale={1}
      onStop={handleStop}
    >
      <div style={{backgroundColor: 'red', width: 50, height: '100%'}}>Yeay it works !!!</div>
    </Draggable></div>
  );
}

export default DraggableSelection