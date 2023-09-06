class Heap {
    constructor(greaterFn) {
        this.arr = new Array();
        this.arr.push(null); // dummy element
        this.greaterFn = greaterFn;
        this. n = 0;
    }

    insert(element) {
        this.arr.push(element);
        this.n++;
        this.swim(this.n);
    }

    delete() {
        if (this.n == 0)
            return undefined;

        const [element] = this.arr.splice(1, 1);
        this.n--;

        if (this.n > 1) {
            this.arr[1] = this.arr[this.n];
            this.sink(1);
        }
        return element;
    }

    sink(x) {
        while (2 * x <= this.n) {
            let j = 2 * x;
            if (j < this.n && this.greaterFn(this.arr[j + 1], this.arr[j])) j = j + 1;
            if (this.greaterFn(this.arr[x], this.arr[j])) break;

            const temp = this.arr[x];
            this.arr[x] = this.arr[j];
            this.arr[j] = temp;

            x = j;
        }
    }

    swim(x) {
        while (x > 1 && this.greaterFn(this.arr[floor(x/2)], this.arr[x])) {
            const parent = floor(x/2);
            const temp = this.arr[x];
            this.arr[x] = this.arr[parent];
            this.arr[parent] = temp;

            x = parent;
        }
    }

    heapify() {
        for (let i = floor(this.n / 2); i > 0; i--)
            this.sink(i);
    }
}