from code_dev import mean


def test_mean():
    assert mean([1, 3]) == 2
    assert mean([0, 0]) == 0
    assert mean([0]) == 0
    # assert mean([]) = NaN
    # assert mean([12345678901234567890, 12345678901234567890])


test_mean()
