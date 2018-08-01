# from code import mean
import code

def test_mean():
    assert code.mean([1, 3]) == 2
    assert code.mean([0, 0]) == 0
    assert code.mean([0]) == 0
    # assert mean([]) = NaN
    # assert mean([12345678901234567890, 12345678901234567890])


test_mean()
