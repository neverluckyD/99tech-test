// Time complexity: O(n)
// Space complexity: O(1)   
var sum_to_n_a = function (n: number): number {
    let total = 0;
    for (let i = 1; i <= n; i++) {
        total += i;
    }
    return total;
};

// Time complexity: O(1)
// Space complexity: O(1)
var sum_to_n_b = function (n: number): number {
    return n * (n + 1) / 2;
};

// Time complexity: O(n)
// Space complexity: O(n)
var sum_to_n_c = function (n: number): number {
    if (n <= 1) return 1;

    return n + sum_to_n_c(n - 1);
};