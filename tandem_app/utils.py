import os

def get_most_frequent(count_dict, n):
    items = sorted(count_dict.items(), key=lambda t: t[1])
    trimmed = items[:n] if n <= len(items) else items
    return [l for l, _ in trimmed]


def collect_counts(collection, exclude):
    counts = {}
    for i in collection:
        if i in exclude:
            continue
        if i in counts:
            counts[i] += 1
        else:
            counts[i] = 1

    return counts


def handle_picture(file, user_id):
    with open(os.path.join("staticfiles", "userfiles", str(user_id) + ".png"), "wb") as f:
        for chunk in file.chunks():
            f.write(chunk)