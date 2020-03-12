const ChartPainter = {

    init() {
        this.cw = new Gmt.CanvasWrapper('canvas-home');
    },

    draw(chartData) {
        this.cw.fill('white');
        let bounds = this.cw.getBoundingRect();
        let barWidth = bounds.width / (chartData.max - chartData.min + 1);
        let maxNofRolls = Math.max(...chartData.rollTable);
        let barFill = Gmt.rgb(0, 150, 0);
        let barStroke = Gmt.rgb(0, 100, 0);
        let fontFill = Gmt.rgb(0, 0, 0);
        for(let i = chartData.min; i <= chartData.max; i++) {
            let h = chartData.rollTable[i]/maxNofRolls * bounds.height;
            let bar = new Gmt.Rectangle(
                (i - chartData.min) * barWidth , 
                bounds.height - h, 
                barWidth, 
                h
            );
            this.cw.drawRect(bar, barFill, barStroke, 0.5);
        }
        let step = Math.ceil((chartData.max - chartData.min + 1)/20)
        for(let i = chartData.min; i <= chartData.max; i += step) {
            this.cw.write(
                i,
                (i - chartData.min) * barWidth + 5,
                bounds.height - 50,
                fontFill,
                barWidth * 0.7
            );
        }
    }

}